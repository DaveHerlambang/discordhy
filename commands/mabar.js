const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');
const sessions = require('../features/mabar/sessions');
const { buildMessage, buildClosedMessage } = require('../features/mabar/view');

const ephemeral = content => ({ content, flags: MessageFlags.Ephemeral });

// Bots can only move members who are already in a voice channel; anyone else gets the link button.
async function moveToHostChannel(member, session) {
    const targetId = session.voiceChannelId;
    const currentId = member.voice.channelId;

    if (currentId === targetId) return 'Kamu sudah ada di voice channel-nya, gas!';
    if (!currentId) {
        return `Kamu belum ada di voice channel mana pun, jadi gak bisa dipindahin. Klik tombol "Voice Channel" atau masuk ke <#${targetId}> sendiri ya.`;
    }

    try {
        await member.voice.setChannel(targetId, 'Mabar: member clicked Join');
        return `Kamu dipindahin ke <#${targetId}>.`;
    } catch (error) {
        logger.warn('MABAR', `Could not move ${member.user.tag}:`, error.message);
        return 'Gak bisa mindahin kamu (bot butuh permission Move Members). Klik tombol "Voice Channel" aja ya.';
    }
}

async function announceFull(interaction, session) {
    const userIds = [...session.joined];
    try {
        await interaction.channel.send({
            content: `Slot mabar ${session.game} sudah penuh! ${userIds.map(id => `<@${id}>`).join(' ')}`,
            allowedMentions: { users: userIds },
        });
    } catch (error) {
        logger.warn('MABAR', 'Could not announce full session:', error.message);
    }
}

async function handleJoin(interaction, session) {
    const { status, becameFull } = sessions.join(session, interaction.user.id);
    if (status === 'full') {
        await interaction.reply(ephemeral('Slot sudah penuh, coba lagi kalau ada yang skip.'));
        return;
    }

    await interaction.update(buildMessage(session));
    if (becameFull) {
        await announceFull(interaction, session);
    }
    if (session.voiceChannelId) {
        await interaction.followUp(ephemeral(await moveToHostChannel(interaction.member, session)));
    }
}

async function handleSkip(interaction, session) {
    sessions.skip(session, interaction.user.id);
    await interaction.update(buildMessage(session));
}

async function handleClose(interaction, session) {
    if (interaction.user.id !== session.hostId) {
        await interaction.reply(ephemeral('Cuma host yang bisa nutup sesi ini.'));
        return;
    }

    sessions.close(session);
    await interaction.update(buildClosedMessage(session, 'host'));
}

module.exports = {
    enabled: config.features.mabar,
    errorMessage: 'Gagal bikin mabar, coba lagi ya!',

    data: new SlashCommandBuilder()
        .setName('mabar')
        .setDescription('Ajak mabar: Join pindah ke voice channel kamu, atau jadi polling kalau kamu belum di voice')
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName('game')
                .setDescription('Mau main apa?')
                .setRequired(true)
                .setMaxLength(50))
        .addIntegerOption(option =>
            option.setName('slot')
                .setDescription('Jumlah pemain maksimal, termasuk kamu (kosongkan kalau bebas)')
                .setMinValue(2)
                .setMaxValue(config.mabar.maxSlot)),

    async execute(interaction) {
        const session = sessions.create({
            game: interaction.options.getString('game', true),
            hostId: interaction.user.id,
            guildId: interaction.guildId,
            voiceChannelId: interaction.member?.voice?.channelId ?? null,
            slot: interaction.options.getInteger('slot'),
        });

        await interaction.reply(buildMessage(session));
        sessions.start(session, await interaction.fetchReply());
    },

    async handleComponent(interaction) {
        const session = sessions.get(interaction.message.id);
        if (!session) {
            await interaction.update({ components: [] });
            await interaction.followUp(ephemeral('Sesi mabar ini sudah berakhir.'));
            return;
        }

        const [, action] = interaction.customId.split(':');
        if (action === 'join') return handleJoin(interaction, session);
        if (action === 'skip') return handleSkip(interaction, session);
        if (action === 'close') return handleClose(interaction, session);
    },
};

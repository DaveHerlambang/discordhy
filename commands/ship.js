const crypto = require('crypto');
const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, escapeMarkdown } = require('discord.js');
const config = require('../config');
const shipVerdicts = require('../data/shipVerdicts');

const BAR_LENGTH = 10;

// Same pair always gets the same result, whichever order they are given in.
function rollPair(idA, idB) {
    const [low, high] = [idA, idB].sort();
    const digest = crypto.createHash('sha256').update(`ship:${low}:${high}`).digest();
    return { score: digest.readUInt32BE(0) % 101, pick: digest.readUInt32BE(4) };
}

function loveBar(score) {
    const filled = Math.round(score / (100 / BAR_LENGTH));
    return '▰'.repeat(filled) + '▱'.repeat(BAR_LENGTH - filled);
}

// An empty option means the person running the command.
function resolvePerson(interaction, optionName) {
    const user = interaction.options.getUser(optionName);
    if (!user) {
        return { user: interaction.user, name: interaction.member?.displayName ?? interaction.user.displayName };
    }
    return { user, name: interaction.options.getMember(optionName)?.displayName ?? user.displayName };
}

function buildShipEmbed(a, b) {
    const isSelf = a.user.id === b.user.id;
    const { score: rolled, pick } = rollPair(a.user.id, b.user.id);
    const score = isSelf ? 100 : rolled;

    const tier = shipVerdicts.tiers.find(t => score >= t.min);
    const { emoji, lines } = isSelf ? shipVerdicts.self : tier;

    return new EmbedBuilder()
        .setTitle(`${escapeMarkdown(a.name)} x ${escapeMarkdown(b.name)} ${emoji}`)
        .setDescription(`${loveBar(score)}  **${score}%**\n${lines[pick % lines.length]}`)
        .setColor(config.colors[tier.color])
        .setFooter({ text: 'mau dicek berapa kali juga hasilnya sama. terima aja.' });
}

function buildMentionLine(a, b) {
    if (a.user.id === b.user.id) {
        return `${a.user} lagi nge-ship diri sendiri`;
    }
    return `${a.user} ${b.user} kalian lagi di-ship nih`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('cek seberapa cocok dua orang')
        .setContexts(InteractionContextType.Guild)
        .addUserOption(option =>
            option.setName('dia')
                .setDescription('siapa yang mau di-ship')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('sama')
                .setDescription('di-ship sama siapa (kosongin = kamu)')),

    async execute(interaction) {
        const a = resolvePerson(interaction, 'dia');
        const b = resolvePerson(interaction, 'sama');

        await interaction.reply({
            content: buildMentionLine(a, b),
            embeds: [buildShipEmbed(a, b)],
            allowedMentions: { users: [...new Set([a.user.id, b.user.id])] },
        });
    },
};

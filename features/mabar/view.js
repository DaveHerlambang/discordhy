const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../../config');

const MAX_LISTED_USERS = 30;

const CLOSED_FOOTERS = {
    expired: 'Sesi mabar sudah berakhir.',
    host: 'Sesi ditutup oleh host.',
};

function formatUsers(userIds) {
    if (userIds.size === 0) return '-';
    const ids = [...userIds];
    const shown = ids.slice(0, MAX_LISTED_USERS).map(id => `<@${id}>`).join('\n');
    return ids.length > MAX_LISTED_USERS ? `${shown}\n+${ids.length - MAX_LISTED_USERS} lainnya` : shown;
}

const HINT = 'kalo mau ayok gas, kalo gak yaudah skip.';

// closedReason is null while the session is open, otherwise a key of CLOSED_FOOTERS.
function buildEmbed(session, closedReason) {
    const location = session.voiceChannelId
        ? `Voice channel: <#${session.voiceChannelId}>`
        : 'Mode polling: host belum ada di voice channel.';
    const joinTitle = session.slot ? `Gas! (${session.joined.size}/${session.slot})` : `Gas! (${session.joined.size})`;

    const lines = [`<@${session.hostId}> ngajak mabar!`, location];
    if (!closedReason) {
        lines.push('', HINT);
    }

    const embed = new EmbedBuilder()
        .setTitle(`Mabar: ${session.game}`)
        .setDescription(lines.join('\n'))
        .addFields(
            { name: joinTitle, value: formatUsers(session.joined), inline: true },
            { name: `Skip (${session.skipped.size})`, value: formatUsers(session.skipped), inline: true }
        )
        .setColor(closedReason ? config.colors.mabarClosed : config.colors.mabar);

    if (closedReason) {
        embed.setFooter({ text: CLOSED_FOOTERS[closedReason] });
    }
    return embed;
}

function buildComponents(session) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('mabar:join').setLabel('Gas!').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('mabar:skip').setLabel('Skip').setStyle(ButtonStyle.Secondary)
    );

    if (session.voiceChannelId) {
        row.addComponents(
            new ButtonBuilder()
                .setLabel('Voice Channel')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/channels/${session.guildId}/${session.voiceChannelId}`)
        );
    }

    row.addComponents(new ButtonBuilder().setCustomId('mabar:close').setLabel('Tutup').setStyle(ButtonStyle.Danger));
    return [row];
}

function buildMessage(session) {
    return { embeds: [buildEmbed(session, null)], components: buildComponents(session) };
}

function buildClosedMessage(session, reason) {
    return { embeds: [buildEmbed(session, reason)], components: [] };
}

module.exports = { buildMessage, buildClosedMessage };

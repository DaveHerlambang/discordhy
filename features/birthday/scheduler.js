const { EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
const config = require('../../config');
const logger = require('../../utils/logger');
const store = require('./store');

// DD-MM in the bot's timezone, not the host's.
function todayKey() {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: config.timezone,
        day: '2-digit',
        month: '2-digit',
    }).formatToParts(new Date());
    const part = type => parts.find(p => p.type === type).value;
    return `${part('day')}-${part('month')}`;
}

function buildBirthdayEmbed(userId) {
    return new EmbedBuilder()
        .setTitle('🎂 Happy Birthday! 🎉')
        .setDescription(`HBD dari Silvler dan semua warga discord <@${userId}>! 🎈🎁\n ditunggu traktirannya (server boost HEHEHEHE)`)
        .setColor(config.colors.birthday)
        .setTimestamp();
}

async function announceBirthdays(client) {
    const userIds = store.getUserIdsOn(todayKey());
    if (userIds.length === 0) return;

    const channel = await client.channels.fetch(config.birthday.channelId);
    for (const userId of userIds) {
        await channel.send({ embeds: [buildBirthdayEmbed(userId)] });
        logger.info('BIRTHDAY', `Announced birthday for ${userId}`);
    }
}

function start(client) {
    schedule.scheduleJob({ rule: '0 0 * * *', tz: config.timezone }, () => {
        announceBirthdays(client).catch(error => logger.error('BIRTHDAY', 'Announcement failed:', error?.stack ?? error));
    });
    logger.info('BIRTHDAY', `Scheduler started (daily 00:00 ${config.timezone})`);
}

module.exports = { start };

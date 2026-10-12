const { Events } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');
const birthdayScheduler = require('../features/birthday/scheduler');

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute(client) {
        logger.info('BOT', `Logged in as ${client.user.tag} with ${client.commands.size} commands`);

        if (config.features.birthday) {
            birthdayScheduler.start(client);
        }
    },
};

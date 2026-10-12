const { Events } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');
const yapCounter = require('../features/yapCounter');
const hyReply = require('../features/hyReply');

const messageFeatures = [
    { name: 'yapCounter', handler: yapCounter },
    { name: 'hyReply', handler: hyReply },
].filter(feature => config.features[feature.name]);

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        if (message.author.bot) return;

        // Run each feature in isolation so one failure doesn't block the others.
        for (const { name, handler } of messageFeatures) {
            try {
                await handler.handleMessage(message);
            } catch (error) {
                logger.error('MESSAGE', `${name} failed:`, error?.stack ?? error);
            }
        }
    },
};

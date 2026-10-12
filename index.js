const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');
const logger = require('./utils/logger');
const { loadCommands } = require('./utils/loadCommands');

const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages];
if (config.features.hyReply) {
    // Privileged intent: only needed to read message text.
    intents.push(GatewayIntentBits.MessageContent);
}
if (config.features.mabar) {
    // Lets the bot see which voice channel a member is in.
    intents.push(GatewayIntentBits.GuildVoiceStates);
}

const client = new Client({ intents });
client.commands = loadCommands();

const eventsDir = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsDir).filter(name => name.endsWith('.js'))) {
    const event = require(path.join(eventsDir, file));
    const listener = async (...args) => {
        try {
            await event.execute(...args);
        } catch (error) {
            logger.error('EVENT', `${event.name} handler failed:`, error?.stack ?? error);
        }
    };
    client[event.once ? 'once' : 'on'](event.name, listener);
}

process.on('unhandledRejection', error => {
    logger.error('PROCESS', 'Unhandled promise rejection:', error?.stack ?? error);
});

client.login(config.discord.token);

const { Events } = require('discord.js');
const logger = require('../utils/logger');
const { safeExecute } = require('../utils/safeExecute');

const COMPONENT_ERROR_MESSAGE = 'Terjadi error saat memproses pilihanmu. Coba lagi!';

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        const { commands } = interaction.client;

        if (interaction.isChatInputCommand()) {
            const command = commands.get(interaction.commandName);
            if (!command) return;

            logger.info('CMD', `/${interaction.commandName} by ${interaction.user.tag} in #${interaction.channel?.name}`);
            await safeExecute(interaction, `/${interaction.commandName}`, () => command.execute(interaction), command.errorMessage);
            return;
        }

        // Component customIds are namespaced by command name: "<command>:<step>[:<arg>]".
        if (interaction.isMessageComponent()) {
            const [commandName] = interaction.customId.split(':');
            const command = commands.get(commandName);
            if (!command?.handleComponent) return;

            logger.info('COMPONENT', `${interaction.customId} values=${interaction.values?.join(',')} by ${interaction.user.tag}`);
            await safeExecute(interaction, `component ${interaction.customId}`, () => command.handleComponent(interaction), COMPONENT_ERROR_MESSAGE);
        }
    },
};

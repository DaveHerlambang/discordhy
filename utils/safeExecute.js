const { MessageFlags } = require('discord.js');
const logger = require('./logger');

const DEFAULT_ERROR_MESSAGE = 'Ada error waktu jalanin perintah ini, coba lagi nanti ya!';

async function sendErrorResponse(interaction, content) {
    if (interaction.replied) {
        await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
    } else if (interaction.deferred) {
        // Ephemerality is fixed by the initial defer, so replace the pending response instead.
        await interaction.editReply({ content, embeds: [], components: [] });
    } else {
        await interaction.reply({ content, flags: MessageFlags.Ephemeral });
    }
}

async function safeExecute(interaction, label, handler, errorMessage = DEFAULT_ERROR_MESSAGE) {
    try {
        await handler();
    } catch (error) {
        logger.error('INTERACTION', `${label} failed:`, error?.stack ?? error);
        try {
            await sendErrorResponse(interaction, errorMessage);
        } catch (responseError) {
            logger.error('INTERACTION', `Could not send error response for ${label}:`, responseError?.message ?? responseError);
        }
    }
}

module.exports = { safeExecute };

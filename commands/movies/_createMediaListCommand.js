const { SlashCommandBuilder } = require('discord.js');
const tmdb = require('../../services/tmdb');
const { mediaTypeSelectRow, buildMediaEmbed } = require('./_shared');

// Builds a "pick Film/Series, then show a TMDB list" command (e.g. popular, top rated).
function createMediaListCommand({ name, description, prompt, category, heading, color }) {
    return {
        data: new SlashCommandBuilder().setName(name).setDescription(description),

        async execute(interaction) {
            await interaction.reply({
                content: `${interaction.user} ${prompt}`,
                components: [mediaTypeSelectRow(`${name}:type`)],
            });
        },

        async handleComponent(interaction) {
            const type = interaction.values[0];
            await interaction.deferUpdate();
            const results = await tmdb.getList(category, type);

            await interaction.editReply({
                content: heading(type),
                components: [],
                embeds: results.map(item => buildMediaEmbed(item, color)),
            });
        },
    };
}

module.exports = { createMediaListCommand };

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config');

// TheCatAPI and TheDogAPI share the same API key and response shape.
function createAnimalCommand({ name, description, apiUrl, title, caption, errorMessage }) {
    return {
        data: new SlashCommandBuilder().setName(name).setDescription(description),
        errorMessage,

        async execute(interaction) {
            await interaction.deferReply();
            const { data } = await axios.get(apiUrl, {
                headers: { 'x-api-key': config.apiKeys.cat },
                timeout: 10_000,
            });

            const imageUrl = data?.[0]?.url;
            if (!imageUrl) {
                throw new Error(`${apiUrl} returned no image`);
            }

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(caption)
                .setImage(imageUrl)
                .setColor(config.colors.animal);

            await interaction.editReply({ embeds: [embed] });
        },
    };
}

module.exports = { createAnimalCommand };

const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../config');
const tmdb = require('../../services/tmdb');
const { mediaTypeSelectRow, buildMediaEmbed } = require('./_shared');

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

async function showTypeSelect(interaction) {
    const genre = interaction.values[0];
    await interaction.update({
        content: `Genre **${genre}** dipilih. Sekarang pilih tipe:`,
        components: [mediaTypeSelectRow(`movie:type:${genre}`)],
    });
}

async function showRecommendations(interaction, genre) {
    const type = interaction.values[0];
    await interaction.deferUpdate();
    const results = await tmdb.getRecommendations(genre, type);

    await interaction.editReply({
        content: `Rekomendasi **${genre}** (${type}):`,
        components: [],
        embeds: results.map(item => buildMediaEmbed(item, config.colors.movieRecommendation)),
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movie')
        .setDescription('Dapatkan rekomendasi film/series, daripada lu cari sendiri wkwkwk'),

    async execute(interaction) {
        const genreSelect = new StringSelectMenuBuilder()
            .setCustomId('movie:genre')
            .setPlaceholder('Pilih genre')
            .addOptions(tmdb.getAvailableGenres().map(genre => ({ label: capitalize(genre), value: genre })));

        await interaction.reply({
            content: `${interaction.user} meminta rekomendasi film/series.\nPilih genre yang kamu inginkan:`,
            components: [new ActionRowBuilder().addComponents(genreSelect)],
        });
    },

    async handleComponent(interaction) {
        const [, step, genre] = interaction.customId.split(':');
        if (step === 'genre') return showTypeSelect(interaction);
        if (step === 'type') return showRecommendations(interaction, genre);
    },
};

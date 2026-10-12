const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

const MEDIA_TYPE_OPTIONS = [
    { label: 'Film', value: 'movies' },
    { label: 'Series', value: 'series' },
];

function mediaTypeSelectRow(customId) {
    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder('Film atau Series?')
            .addOptions(MEDIA_TYPE_OPTIONS)
    );
}

function buildMediaEmbed(item, color) {
    const fields = [{ name: 'Rating', value: item.rating, inline: true }];
    if (item.platform) {
        fields.push({ name: 'Platform', value: item.platform, inline: true });
    }
    fields.push({ name: 'Bahasa', value: item.originalLanguage?.toUpperCase() || 'N/A', inline: true });

    const embed = new EmbedBuilder()
        .setTitle(item.year ? `${item.title} (${item.year})` : item.title)
        .setDescription(item.synopsis || 'Tidak ada sinopsis.')
        .addFields(fields)
        .setColor(color);

    if (item.image) {
        embed.setImage(item.image);
    }
    return embed;
}

module.exports = { mediaTypeSelectRow, buildMediaEmbed };

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('excuses')
        .setDescription('excuses excuses excuses!'),
    errorMessage: 'Gagal mengambil alasan dari NaaS API. Coba lagi nanti!',

    async execute(interaction) {
        await interaction.deferReply();
        const { data } = await axios.get('https://naas.isalman.dev/no', { timeout: 10_000 });
        await interaction.editReply(`The reason to say no today is: ${data.reason}`);
    },
};

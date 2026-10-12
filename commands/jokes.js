const { SlashCommandBuilder } = require('discord.js');
const { ShuffleBag } = require('../utils/random');
const jokesBapakBapak = require('../data/jokesBapakBapak');

const jokeBag = new ShuffleBag(jokesBapakBapak);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jokes')
        .setDescription('xixixixi'),

    async execute(interaction) {
        await interaction.reply(jokeBag.next());
    },
};

const config = require('../../config');
const { createMediaListCommand } = require('./_createMediaListCommand');

module.exports = createMediaListCommand({
    name: 'topratedmovie',
    description: 'Lihat film dengan rating tertinggi, anjoooyy keren gak gue?',
    prompt: 'mau liat yang rating tinggi nih. Film atau Series?',
    category: 'top_rated',
    heading: type => `**Top Rated ${type}**:`,
    color: config.colors.movieTopRated,
});

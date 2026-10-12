const config = require('../../config');
const { createMediaListCommand } = require('./_createMediaListCommand');

module.exports = createMediaListCommand({
    name: 'popularmovie',
    description: 'Lihat film populer saat ini, biasanya sih sampah tapi okelah ya? jangan banyak protes',
    prompt: 'mau liat yang populer nih. Film atau Series?',
    category: 'popular',
    heading: type => `**Popular ${type}**:`,
    color: config.colors.moviePopular,
});

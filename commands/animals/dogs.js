const { createAnimalCommand } = require('./_createAnimalCommand');

module.exports = createAnimalCommand({
    name: 'dogs',
    description: 'guguk guguk guguk',
    apiUrl: 'https://api.thedogapi.com/v1/images/search',
    title: 'Guguk',
    caption: 'woof',
    errorMessage: 'error waktu ambil gambar anjing, maafin silvler :(',
});

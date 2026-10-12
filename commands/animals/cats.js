const { createAnimalCommand } = require('./_createAnimalCommand');

module.exports = createAnimalCommand({
    name: 'cats',
    description: 'GAMBAR KUCING NOOH, MAU APA LAGI??!',
    apiUrl: 'https://api.thecatapi.com/v1/images/search',
    title: 'Kocheng',
    caption: 'meow',
    errorMessage: 'error waktu ambil gambar kucing, maafin silvler :(',
});

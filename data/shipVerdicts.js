// Tiers are checked top to bottom; the first one whose `min` the score reaches wins.
// `color` is a key of config.colors.
module.exports = {
    self: {
        emoji: '💅',
        lines: [
            'ship sama diri sendiri? valid sih, self love itu penting.',
            'gak ada yang lebih cocok sama lo selain lo sendiri. aman.',
        ],
    },
    tiers: [
        {
            min: 100,
            emoji: '💞',
            color: 'shipSoulmate',
            lines: [
                'udah, jodoh. gak usah dibahas lagi.',
                'seratus persen. kalian ngapain masih di discord, sana jalan.',
            ],
        },
        {
            min: 90,
            emoji: '💖',
            color: 'shipSoulmate',
            lines: [
                'udah lah jadian aja, satu server juga udah tau.',
                'serasi parah. undangannya jangan lupa ya.',
            ],
        },
        {
            min: 70,
            emoji: '😍',
            color: 'shipHot',
            lines: [
                'tinggal nunggu salah satu berani ngomong duluan.',
                'chemistry-nya kerasa sampe sini, gak usah gengsi.',
            ],
        },
        {
            min: 50,
            emoji: '😊',
            color: 'shipWarm',
            lines: [
                'cocok kok, kurang dorongan dikit aja.',
                'udah ada bibit-bibitnya. siram terus aja.',
            ],
        },
        {
            min: 30,
            emoji: '🙂',
            color: 'shipWarm',
            lines: [
                'lumayan. sering-sering mabar bareng dulu aja.',
                'gak jelek, gak bagus juga. pelan-pelan lah.',
            ],
        },
        {
            min: 10,
            emoji: '😬',
            color: 'shipCold',
            lines: [
                'ada sih, dikit banget. kayak sinyal di basement.',
                'masih jauh. kenalan yang bener dulu.',
            ],
        },
        {
            min: 0,
            emoji: '💀',
            color: 'shipCold',
            lines: [
                'temenan aja ya. itu juga kalo masih mau.',
                'ini bukan jodoh, ini musuh bebuyutan.',
            ],
        },
    ],
};

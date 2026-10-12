require('dotenv').config();

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name} (see .env.example)`);
    }
    return value;
}

module.exports = {
    discord: {
        token: requireEnv('DISCORD_TOKEN'),
        clientId: '1322473801308704788',
    },

    apiKeys: {
        tmdb: requireEnv('TMDB_API_KEY'),
        cat: requireEnv('CAT_API_KEY'),
    },

    timezone: 'Asia/Jakarta',

    features: {
        yapCounter: true,
        hyReply: false,
        birthday: false,
        mabar: true,
    },

    yapCounter: {
        targetUserId: '717314850581118988',
        threshold: 3,
    },

    hyReply: {
        targetUserId: '989474580672438323',
        strangerReply: 'kamu siapa?! kamu bukan silver!',
        strangerGif: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm1zcXF5em1ya24zZzBiMmxmcGthdmZyb25maTJnMXU0N2sxbjNqcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rCftUAVPLExZC/giphy.gif',
    },

    birthday: {
        channelId: '1303746779031797882',
    },

    mabar: {
        sessionMinutes: 120,
        maxSlot: 25,
    },

    colors: {
        animal: '#ff9900',
        movieRecommendation: '#e67e22',
        moviePopular: '#3498db',
        movieTopRated: '#9b59b6',
        birthday: '#ff69b4',
        mabar: '#2ecc71',
        mabarClosed: '#95a5a6',
        shipCold: '#a4b0be',
        shipWarm: '#f8a5c2',
        shipHot: '#ff6fae',
        shipSoulmate: '#e84393',
    },
};

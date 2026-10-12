const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { randomInt, shuffle } = require('../utils/random');

const GENRE_IDS = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    horror: 27,
    mystery: 9648,
    romance: 10749,
    'sci-fi': 878,
    thriller: 53,
    war: 10752,
};

const RESULT_COUNT = 5;
const LANGUAGE = 'id-ID';
const WATCH_REGION = 'ID';
const DEFAULT_PLATFORM = 'Theater/Streaming';

const http = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: { api_key: config.apiKeys.tmdb },
    timeout: 10_000,
});

const mediaPath = type => (type === 'movies' ? 'movie' : 'tv');

function mapItem(item, type) {
    const isMovie = type === 'movies';
    const releaseDate = isMovie ? item.release_date : item.first_air_date;

    return {
        id: item.id,
        title: isMovie ? item.title : item.name,
        synopsis: item.overview,
        image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        year: releaseDate ? releaseDate.slice(0, 4) : null,
        rating: (item.vote_average ?? 0).toFixed(1),
        originalLanguage: item.original_language,
    };
}

async function getWatchProviders(id, type) {
    try {
        const { data } = await http.get(`/${mediaPath(type)}/${id}/watch/providers`);
        const region = data.results?.[WATCH_REGION];
        if (!region) return null;

        const names = [...(region.flatrate ?? []), ...(region.free ?? []), ...(region.ads ?? [])]
            .map(provider => provider.provider_name);
        return [...new Set(names)].join(', ') || null;
    } catch (error) {
        logger.warn('TMDB', `Watch providers failed for ${type} ${id}:`, error.message);
        return null;
    }
}

function getAvailableGenres() {
    return Object.keys(GENRE_IDS);
}

async function getRecommendations(genre, type) {
    logger.info('TMDB', `getRecommendations genre=${genre} type=${type}`);
    const { data } = await http.get(`/discover/${mediaPath(type)}`, {
        params: {
            with_genres: GENRE_IDS[genre],
            language: LANGUAGE,
            sort_by: 'popularity.desc',
            include_adult: false,
            page: randomInt(5) + 1,
        },
    });

    const items = shuffle(data.results).slice(0, RESULT_COUNT).map(item => mapItem(item, type));
    const platforms = await Promise.all(items.map(item => getWatchProviders(item.id, type)));
    return items.map((item, i) => ({ ...item, platform: platforms[i] ?? DEFAULT_PLATFORM }));
}

// category: 'popular' | 'top_rated'
async function getList(category, type) {
    logger.info('TMDB', `getList category=${category} type=${type}`);
    const { data } = await http.get(`/${mediaPath(type)}/${category}`, {
        params: { language: LANGUAGE },
    });
    return data.results.slice(0, RESULT_COUNT).map(item => mapItem(item, type));
}

module.exports = { getAvailableGenres, getRecommendations, getList };

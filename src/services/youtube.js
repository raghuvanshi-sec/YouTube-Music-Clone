import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!API_KEY) {
    console.error("YouTube API Key is missing! Please check your .env file.");
}

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
    }
});

export const getHomeVideos = async () => {
    try {
        const response = await api.get('/videos', {
            params: {
                chart: 'mostPopular',
                regionCode: 'US', // Can be dynamic
                videoCategoryId: '10', // Music category
                maxResults: 20,
                part: 'snippet,contentDetails'
            }
        });
        return response.data.items;
    } catch (error) {
        console.error("Error fetching home videos", error);
        return [];
    }
};

export const searchVideos = async (query) => {
    try {
        const response = await api.get('/search', {
            params: {
                q: query,
                type: 'video',
                videoCategoryId: '10', // Music
                maxResults: 20,
                part: 'snippet'
            }
        });
        // Search endpoint returns 'id' as an object { kind, videoId }, need to normalize
        return response.data.items.map(item => ({
            ...item,
            id: item.id.videoId // Normalize ID
        }));
    } catch (error) {
        console.error("Error searching videos", error);
        return [];
    }
};

import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import VideoCard from '../components/VideoCard';
import { getHomeVideos } from '../services/youtube';
import { FaFire, FaStar, FaHeadphones, FaMusic, FaHeart, FaPlay } from 'react-icons/fa';
import './Explore.css';

const Explore = () => {
    const { playVideo } = usePlayer();
    const [videos, setVideos] = useState([]);
    const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
    const [moodCategories, setMoodCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getHomeVideos();
                setVideos(data);
                
                // Generate mock data for featured playlists and mood categories
                setFeaturedPlaylists([
                    {
                        id: 'chill-vibes',
                        name: 'Chill Vibes',
                        description: 'Relax and unwind with these smooth tracks',
                        color: '#4f46e5',
                        songs: data.slice(0, 5)
                    },
                    {
                        id: 'workout-mix',
                        name: 'Workout Mix',
                        description: 'High energy tracks to power your workout',
                        color: '#ef4444',
                        songs: data.slice(5, 10)
                    },
                    {
                        id: 'study-session',
                        name: 'Study Session',
                        description: 'Focus music for productive study sessions',
                        color: '#10b981',
                        songs: data.slice(10, 15)
                    }
                ]);

                setMoodCategories([
                    { id: 'happy', name: 'Happy', icon: FaFire, color: '#f59e0b' },
                    { id: 'chill', name: 'Chill', icon: FaStar, color: '#6366f1' },
                    { id: 'energetic', name: 'Energetic', icon: FaHeadphones, color: '#ef4444' },
                    { id: 'romantic', name: 'Romantic', icon: FaHeart, color: '#ec4899' },
                    { id: 'focus', name: 'Focus', icon: FaMusic, color: '#10b981' }
                ]);
            } catch (error) {
                console.error('Error fetching explore data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePlaylistPlay = (playlist) => {
        if (playlist.songs.length > 0) {
            playVideo(playlist.songs[0]);
        }
    };

    const handleMoodSelect = (mood) => {
        // Filter videos based on mood (mock implementation)
        const filteredVideos = videos.filter((_, index) => index % 2 === 0);
        setVideos(filteredVideos);
    };

    if (loading) {
        return (
            <div className="explore-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="explore-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Discover Music</h1>
                    <p className="hero-subtitle">Find your next favorite song, artist, or playlist</p>
                </div>
            </section>

            {/* Mood Categories */}
            <section className="mood-section">
                <h2 className="section-title">Browse by Mood</h2>
                <div className="mood-grid">
                    {moodCategories.map((mood) => {
                        const Icon = mood.icon;
                        return (
                            <div 
                                key={mood.id} 
                                className="mood-card"
                                style={{ borderColor: mood.color }}
                                onClick={() => handleMoodSelect(mood)}
                            >
                                <div className="mood-icon" style={{ backgroundColor: mood.color }}>
                                    <Icon size={24} color="white" />
                                </div>
                                <div className="mood-info">
                                    <h3>{mood.name}</h3>
                                    <p>Discover music for your mood</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Featured Playlists */}
            <section className="playlists-section">
                <h2 className="section-title">Featured Playlists</h2>
                <div className="playlists-grid">
                    {featuredPlaylists.map((playlist) => (
                        <div key={playlist.id} className="featured-playlist">
                            <div className="playlist-header" style={{ backgroundColor: playlist.color }}>
                                <div className="playlist-info">
                                    <h3>{playlist.name}</h3>
                                    <p>{playlist.description}</p>
                                    <span className="song-count">{playlist.songs.length} songs</span>
                                </div>
                                <div className="playlist-art">
                                    <div className="art-placeholder">
                                        {playlist.songs.slice(0, 4).map((song, index) => (
                                            <img 
                                                key={song.id}
                                                src={song.snippet?.thumbnails?.medium?.url || 'https://via.placeholder.com/60x60'}
                                                alt=""
                                                className={`art-image art-${index}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="playlist-actions">
                                <button 
                                    className="play-all-btn"
                                    onClick={() => handlePlaylistPlay(playlist)}
                                >
                                    Play All
                                </button>
                            </div>
                            <div className="playlist-songs">
                                {playlist.songs.slice(0, 3).map((song) => (
                                    <div key={song.id} className="playlist-song">
                                        <div className="song-info">
                                            <span className="song-title">{song.snippet?.title || 'Unknown Title'}</span>
                                            <span className="song-artist">{song.snippet?.channelTitle || 'Unknown Artist'}</span>
                                        </div>
                                        <button 
                                            className="song-play-btn"
                                            onClick={() => playVideo(song)}
                                        >
                                            <FaPlay size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trending Now */}
            <section className="trending-section">
                <h2 className="section-title">Trending Now</h2>
                <div className="trending-grid">
                    {videos.slice(0, 8).map((video) => (
                        <div key={video.id} className="trending-card">
                            <VideoCard video={video} />
                            <div className="trending-overlay">
                                <button 
                                    className="trending-play-btn"
                                    onClick={() => playVideo(video)}
                                >
                                    <FaPlay />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Explore;
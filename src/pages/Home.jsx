import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { getHomeVideos } from '../services/youtube';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaHeart, FaPlus } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playVideo, addToQueue } = usePlayer();

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const data = await getHomeVideos();
                setVideos(data);
            } catch (error) {
                console.error("Error fetching home videos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const handlePlay = (video) => {
        playVideo(video, videos, videos.indexOf(video));
    };

    const handleAddToQueue = (video) => {
        addToQueue(video);
    };

    const handleLike = (video) => {
        const savedLikes = localStorage.getItem('youtube-music-liked');
        let likedVideos = savedLikes ? JSON.parse(savedLikes) : [];
        
        if (!likedVideos.includes(video.id)) {
            likedVideos.push(video.id);
            localStorage.setItem('youtube-music-liked', JSON.stringify(likedVideos));
        }
    };

    const isLiked = (videoId) => {
        const savedLikes = localStorage.getItem('youtube-music-liked');
        const likedVideos = savedLikes ? JSON.parse(savedLikes) : [];
        return likedVideos.includes(videoId);
    };

    // Helper to separate videos into groups for UI variety
    const newReleases = videos.slice(0, 8);
    const recommended = videos.slice(8, 16);

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-spinner">Loading music...</div>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Good afternoon</h1>
                    <p className="hero-subtitle">Discover your next favorite song</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="action-card" onClick={() => videos[0] && handlePlay(videos[0])}>
                    <div className="action-icon">🎵</div>
                    <div className="action-text">
                        <h3>Play Now</h3>
                        <p>Start listening to trending music</p>
                    </div>
                </button>
                <button className="action-card">
                    <div className="action-icon">🔥</div>
                    <div className="action-text">
                        <h3>Discover Weekly</h3>
                        <p>New music based on your taste</p>
                    </div>
                </button>
                <button className="action-card">
                    <div className="action-icon">❤️</div>
                    <div className="action-text">
                        <h3>Liked Songs</h3>
                        <p>Your favorite tracks</p>
                    </div>
                </button>
            </div>

            {/* Trending Music */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Trending Music</h2>
                    <button className="section-action">View All</button>
                </div>
                <div className="video-grid">
                    {newReleases.map(video => (
                        <div key={video.id} className="video-card-wrapper">
                            <VideoCard video={video} />
                            <div className="video-actions">
                                <button 
                                    className="action-icon play-btn"
                                    onClick={() => handlePlay(video)}
                                    title="Play"
                                >
                                    <FaPlay />
                                </button>
                                <button 
                                    className="action-icon like-btn"
                                    onClick={() => handleLike(video)}
                                    title="Like"
                                >
                                    <FaHeart color={isLiked(video.id) ? '#ff0055' : '#ffffff'} />
                                </button>
                                <button 
                                    className="action-icon queue-btn"
                                    onClick={() => handleAddToQueue(video)}
                                    title="Add to Queue"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recommended for You */}
            {recommended.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">Recommended for you</h2>
                        <button className="section-action">View All</button>
                    </div>
                    <div className="video-grid">
                        {recommended.map(video => (
                            <div key={video.id} className="video-card-wrapper">
                                <VideoCard video={video} />
                                <div className="video-actions">
                                    <button 
                                        className="action-icon play-btn"
                                        onClick={() => handlePlay(video)}
                                        title="Play"
                                    >
                                        <FaPlay />
                                    </button>
                                    <button 
                                        className="action-icon like-btn"
                                        onClick={() => handleLike(video)}
                                        title="Like"
                                    >
                                        <FaHeart color={isLiked(video.id) ? '#ff0055' : '#ffffff'} />
                                    </button>
                                    <button 
                                        className="action-icon queue-btn"
                                        onClick={() => handleAddToQueue(video)}
                                        title="Add to Queue"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recently Played */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Recently Played</h2>
                    <button className="section-action">View All</button>
                </div>
                <div className="recent-grid">
                    {videos.slice(16, 20).map(video => (
                        <div key={video.id} className="recent-card">
                            <div className="recent-thumbnail">
                                <img src={video.snippet?.thumbnails?.medium?.url} alt="" />
                                <button className="recent-play-btn" onClick={() => handlePlay(video)}>
                                    <FaPlay />
                                </button>
                            </div>
                            <div className="recent-info">
                                <h3 className="recent-title">{video.snippet?.title}</h3>
                                <p className="recent-artist">{video.snippet?.channelTitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;

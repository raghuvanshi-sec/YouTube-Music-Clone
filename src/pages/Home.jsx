import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { getHomeVideos } from '../services/youtube';
import { usePlayer } from '../context/PlayerContext'; // Import context
import './Home.css';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const { playVideo } = usePlayer(); // Use playVideo

    useEffect(() => {
        const fetchVideos = async () => {
            const data = await getHomeVideos();
            setVideos(data);
        };
        fetchVideos();
    }, []);

    // Helper to separate videos into groups for UI variety
    const newReleases = videos.slice(0, 8);
    const recommended = videos.slice(8, 16);

    return (
        <div className="home-container">
            <h1 className="section-title">Trending Music</h1>
            <div className="video-grid">
                {newReleases.map(video => (
                    <div key={video.id} onClick={() => playVideo(video)}>
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>

            {recommended.length > 0 && (
                <>
                    <h1 className="section-title" style={{marginTop: '40px'}}>Recommended for you</h1>
                    <div className="video-grid">
                        {recommended.map(video => (
                            <div key={video.id} onClick={() => playVideo(video)}>
                                <VideoCard video={video} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { searchVideos } from '../services/youtube';
import { usePlayer } from '../context/PlayerContext';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [videos, setVideos] = useState([]);
    const { playVideo } = usePlayer();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (query) {
                const data = await searchVideos(query);
                setVideos(data);
            }
        };
        fetchSearchResults();
    }, [query]);

    return (
        <div className="search-results-container">
            <h2 className="search-heading">Results for "{query}"</h2>
            <div className="results-grid">
                 {videos.map(video => (
                    <div key={video.id} onClick={() => playVideo(video)}>
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;

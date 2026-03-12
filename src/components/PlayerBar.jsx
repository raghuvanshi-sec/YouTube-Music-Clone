import YouTube from 'react-youtube';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaShare, FaEllipsisV } from "react-icons/fa";
import { IoVolumeMedium } from "react-icons/io5";
import './PlayerBar.css';

const PlayerBar = () => {
    const { 
        currentVideo, 
        isPlaying, 
        togglePlay, 
        handlePlayerReady, 
        handlePlayerStateChange,
        volume,
        setVolume,
        playNext,
        playPrevious,
        repeatMode,
        shuffle,
        setRepeat,
        toggleShuffle
    } = usePlayer();

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            controls: 0,
        },
    };

    if (!currentVideo) {
        return <div className="player-bar-placeholder">Select a song to play</div>;
    }

    const { snippet } = currentVideo;
    const title = snippet?.title || "Unknown Title";
    const artist = snippet?.channelTitle || "Unknown Artist";
    const thumbnail = snippet?.thumbnails?.default?.url;

    const handleLike = () => {
        const savedLikes = localStorage.getItem('youtube-music-liked');
        let likedVideos = savedLikes ? JSON.parse(savedLikes) : [];
        
        if (likedVideos.includes(currentVideo.id)) {
            likedVideos = likedVideos.filter(id => id !== currentVideo.id);
        } else {
            likedVideos.push(currentVideo.id);
        }
        
        localStorage.setItem('youtube-music-liked', JSON.stringify(likedVideos));
    };

    const isLiked = () => {
        const savedLikes = localStorage.getItem('youtube-music-liked');
        const likedVideos = savedLikes ? JSON.parse(savedLikes) : [];
        return likedVideos.includes(currentVideo.id);
    };

    return (
        <div className="player-bar">
            {/* Hidden Player */}
            <div className="youtube-player-hidden">
                <YouTube 
                    videoId={currentVideo.id} 
                    opts={opts} 
                    onReady={handlePlayerReady}
                    onStateChange={handlePlayerStateChange}
                />
            </div>

            <div className="player-left">
                {thumbnail && <img src={thumbnail} alt="Album Art" className="player-art" />}
                <div className="track-info">
                    <div className="track-title">{title}</div>
                    <div className="track-artist">{artist}</div>
                </div>
                <div className="player-actions">
                    <button className="action-btn" onClick={handleLike}>
                        <FaHeart color={isLiked() ? '#ff0055' : '#ffffff'} />
                    </button>
                    <button className="action-btn">
                        <FaShare />
                    </button>
                    <button className="action-btn">
                        <FaEllipsisV />
                    </button>
                </div>
            </div>

            <div className="player-center">
                <div className="controls">
                    <button className="control-btn" onClick={toggleShuffle}>
                        <span style={{ color: shuffle ? '#ffffff' : '#888888' }}>🔀</span>
                    </button>
                    <button className="control-btn" onClick={playPrevious}>
                        <FaStepBackward />
                    </button>
                    <button className="control-btn play-pause-btn" onClick={togglePlay}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="control-btn" onClick={playNext}>
                        <FaStepForward />
                    </button>
                    <button className="control-btn" onClick={() => setRepeat(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}>
                        <span style={{ color: repeatMode !== 'off' ? '#ffffff' : '#888888' }}>
                            {repeatMode === 'one' ? '🔂' : '🔁'}
                        </span>
                    </button>
                </div>
            </div>

            <div className="player-right">
                <div className="volume-container">
                    <IoVolumeMedium size={24} color="#aaaaaa" />
                    <input 
                        type="range" 
                        className="volume-slider"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerBar;

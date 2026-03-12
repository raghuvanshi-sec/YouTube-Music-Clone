import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaShare, FaEllipsisV } from 'react-icons/fa';
import { IoVolumeMedium } from "react-icons/io5";
import './NowPlaying.css';

const NowPlaying = () => {
    const { 
        currentVideo, 
        isPlaying, 
        togglePlay, 
        handlePlayerReady: contextHandlePlayerReady, 
        handlePlayerStateChange: contextHandlePlayerStateChange,
        volume,
        setVolume
    } = usePlayer();

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showVolume, setShowVolume] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
    };

    useEffect(() => {
        const savedLikes = localStorage.getItem('youtube-music-liked');
        if (savedLikes) {
            const likedVideos = JSON.parse(savedLikes);
            if (currentVideo && likedVideos.includes(currentVideo.id)) {
                setIsLiked(true);
            }
        }
    }, [currentVideo]);

    const handlePlayerStateChange = (event) => {
        contextHandlePlayerStateChange(event);
        
        if (event.data === 1 && event.target && event.target.getDuration) {
            setDuration(event.target.getDuration());
        }
    };

    const handlePlayerReady = (event) => {
        contextHandlePlayerReady(event);
        if (event.target && event.target.getDuration) {
            setDuration(event.target.getDuration());
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleLike = () => {
        if (!currentVideo) return;
        
        const savedLikes = localStorage.getItem('youtube-music-liked');
        let likedVideos = savedLikes ? JSON.parse(savedLikes) : [];
        
        if (isLiked) {
            likedVideos = likedVideos.filter(id => id !== currentVideo.id);
        } else {
            likedVideos.push(currentVideo.id);
        }
        
        localStorage.setItem('youtube-music-liked', JSON.stringify(likedVideos));
        setIsLiked(!isLiked);
    };

    const handleShare = () => {
        if (currentVideo) {
            const url = `https://www.youtube.com/watch?v=${currentVideo.id}`;
            if (navigator.share) {
                navigator.share({
                    title: currentVideo.snippet?.title,
                    text: 'Check out this song!',
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
            }
        }
    };

    if (!currentVideo) {
        return (
            <div className="now-playing-container">
                <div className="empty-state">
                    <div className="empty-icon">🎵</div>
                    <h2>No Song Playing</h2>
                    <p>Start playing a song to see it here</p>
                </div>
            </div>
        );
    }

    const { snippet } = currentVideo;
    const title = snippet?.title || "Unknown Title";
    const artist = snippet?.channelTitle || "Unknown Artist";
    const thumbnail = snippet?.thumbnails?.high?.url;

    return (
        <div className="now-playing-container">
            <div className="now-playing-content">
                {/* Video Player */}
                <div className="video-player">
                    <YouTube 
                        videoId={currentVideo.id} 
                        opts={opts} 
                        onReady={handlePlayerReady}
                        onStateChange={handlePlayerStateChange}
                    />
                </div>

                {/* Song Info */}
                <div className="song-info">
                    <div className="album-art">
                        <img src={thumbnail} alt="Album Art" />
                        <div className="art-overlay">
                            <button className="play-overlay-btn" onClick={togglePlay}>
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                        </div>
                    </div>

                    <div className="song-details">
                        <h1 className="song-title">{title}</h1>
                        <h2 className="song-artist">{artist}</h2>
                        
                        {/* Progress Bar */}
                        <div className="progress-container">
                            <span className="time-display">{formatTime(currentTime)}</span>
                            <input 
                                type="range" 
                                className="progress-bar"
                                min="0"
                                max={duration}
                                value={currentTime}
                                onChange={(e) => {
                                    // Seek to position (this would need player instance)
                                    setCurrentTime(parseInt(e.target.value));
                                }}
                            />
                            <span className="time-display">{formatTime(duration)}</span>
                        </div>

                        {/* Controls */}
                        <div className="player-controls">
                            <button className="control-btn shuffle-btn">🔀</button>
                            <button className="control-btn">
                                <FaStepBackward />
                            </button>
                            <button className="control-btn play-btn" onClick={togglePlay}>
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <button className="control-btn">
                                <FaStepForward />
                            </button>
                            <button className="control-btn repeat-btn">🔁</button>
                        </div>

                        {/* Actions */}
                        <div className="song-actions">
                            <button className="action-btn" onClick={handleLike}>
                                <FaHeart color={isLiked ? '#ff0055' : '#ffffff'} />
                                {isLiked ? 'Liked' : 'Like'}
                            </button>
                            <button className="action-btn" onClick={handleShare}>
                                <FaShare />
                                Share
                            </button>
                            <button className="action-btn">
                                <FaEllipsisV />
                                More
                            </button>
                        </div>

                        {/* Volume Control */}
                        <div className="volume-section">
                            <button 
                                className="volume-btn"
                                onClick={() => setShowVolume(!showVolume)}
                            >
                                <IoVolumeMedium size={24} color="#aaaaaa" />
                            </button>
                            {showVolume && (
                                <div className="volume-slider">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={volume}
                                        onChange={(e) => setVolume(parseInt(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Videos */}
                <div className="related-section">
                    <h3>Related Songs</h3>
                    <div className="related-list">
                        {/* Mock related songs - in a real app, this would come from YouTube API */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="related-song">
                                <div className="related-art">
                                    <img src={thumbnail} alt="" />
                                </div>
                                <div className="related-info">
                                    <span className="related-title">Related Song {i}</span>
                                    <span className="related-artist">{artist}</span>
                                </div>
                                <button className="related-play-btn">
                                    <FaPlay />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NowPlaying;
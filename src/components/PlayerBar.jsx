import YouTube from 'react-youtube';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import { IoVolumeMedium } from "react-icons/io5";
import './PlayerBar.css';

const PlayerBar = () => {
    const { 
        currentVideo, 
        isPlaying, 
        togglePlay, 
        handlePlayerReady, 
        handlePlayerStateChange 
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
            </div>

            <div className="player-center">
                <div className="controls">
                    <button className="control-btn"><FaStepBackward /></button>
                    <button className="control-btn play-pause-btn" onClick={togglePlay}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="control-btn"><FaStepForward /></button>
                </div>
            </div>

            <div className="player-right">
                <IoVolumeMedium size={24} color="#aaaaaa" />
                {/* Volume slider could go here */}
            </div>
        </div>
    );
};

export default PlayerBar;

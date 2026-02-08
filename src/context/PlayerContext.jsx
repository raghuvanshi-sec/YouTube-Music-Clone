import { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);
    const [player, setPlayer] = useState(null);

    const playVideo = (video) => {
        setCurrentVideo(video);
        setIsPlaying(true);
        // If player instance exists, load video
        if (player) {
            player.loadVideoById(typeof video === 'string' ? video : video.id);
        }
    };

    const togglePlay = () => {
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePlayerReady = (event) => {
        setPlayer(event.target);
        event.target.setVolume(volume);
        if (currentVideo) {
             event.target.loadVideoById(typeof currentVideo === 'string' ? currentVideo : currentVideo.id);
             event.target.playVideo();
        }
    };

    const handlePlayerStateChange = (event) => {
        // 1 = Playing, 2 = Paused
        if (event.data === 1) setIsPlaying(true);
        if (event.data === 2) setIsPlaying(false);
    };

    const value = {
        currentVideo,
        isPlaying,
        playVideo,
        togglePlay,
        handlePlayerReady,
        handlePlayerStateChange,
        volume,
        setVolume
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};

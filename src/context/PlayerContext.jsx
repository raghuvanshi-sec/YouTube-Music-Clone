import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

const PlayerProvider = ({ children }) => {
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);
    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration] = useState(0);
    const [queue, setQueue] = useState([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
    const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'
    const [shuffle, setShuffle] = useState(false);

    // 1. Bottom-level utilities
    const saveToRecentlyPlayed = useCallback((video) => {
        if (!video) return;
        const recentData = localStorage.getItem('youtube-music-recent');
        let recent = recentData ? JSON.parse(recentData) : [];
        recent = recent.filter(item => item.id !== video.id);
        recent.unshift(video);
        recent = recent.slice(0, 50);
        localStorage.setItem('youtube-music-recent', JSON.stringify(recent));
    }, []);

    // 2. Play Video (Core Action)
    const playVideo = useCallback((video, newQueue = null, index = 0) => {
        setCurrentVideo(video);
        setIsPlaying(true);
        
        if (newQueue) {
            setQueue(newQueue);
            setCurrentQueueIndex(index);
        }
        
        if (player) {
            const videoId = typeof video === 'string' ? video : video.id;
            player.loadVideoById(videoId);
            player.setVolume(volume);
        }
        
        saveToRecentlyPlayed(video);
    }, [player, volume, saveToRecentlyPlayed]);

    // 3. Queue Navigation
    const playNext = useCallback(() => {
        if (queue.length === 0) return;
        
        let nextIndex = currentQueueIndex + 1;
        if (nextIndex >= queue.length) {
            if (repeatMode === 'all') {
                nextIndex = 0;
            } else {
                setIsPlaying(false);
                return;
            }
        }
        
        setCurrentQueueIndex(nextIndex);
        playVideo(queue[nextIndex], queue, nextIndex);
    }, [queue, currentQueueIndex, repeatMode, playVideo]);

    const playPrevious = useCallback(() => {
        if (queue.length === 0) return;
        
        let prevIndex = currentQueueIndex - 1;
        if (prevIndex < 0) {
            prevIndex = queue.length - 1;
        }
        
        setCurrentQueueIndex(prevIndex);
        playVideo(queue[prevIndex], queue, prevIndex);
    }, [queue, currentQueueIndex, playVideo]);

    // 4. State Handlers
    const handleVideoEnded = useCallback(() => {
        if (repeatMode === 'one') {
            if (player) {
                player.seekTo(0);
                player.playVideo();
            }
        } else if (repeatMode === 'all' || currentQueueIndex < queue.length - 1) {
            playNext();
        } else {
            setIsPlaying(false);
        }
    }, [repeatMode, currentQueueIndex, queue.length, player, playNext]);

    const handlePlayerReady = useCallback((event) => {
        setPlayer(event.target);
        event.target.setVolume(volume);
        
        if (currentVideo) {
            const videoId = typeof currentVideo === 'string' ? currentVideo : currentVideo.id;
            event.target.loadVideoById(videoId);
            if (isPlaying) {
                event.target.playVideo();
            }
        }
    }, [currentVideo, volume, isPlaying]);

    const handlePlayerStateChange = useCallback((event) => {
        // 1 = Playing, 2 = Paused, 0 = Ended
        if (event.data === 1) {
            setIsPlaying(true);
        } else if (event.data === 2) {
            setIsPlaying(false);
        } else if (event.data === 0) {
            handleVideoEnded();
        }
    }, [handleVideoEnded]);

    // 5. Side Effects (Timer for Progress)
    useEffect(() => {
        let timer;
        if (isPlaying && player && player.getCurrentTime) {
            timer = setInterval(() => {
                setCurrentTime(player.getCurrentTime());
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isPlaying, player]);

    // 6. Other Actions
    const togglePlay = useCallback(() => {
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            // isPlaying state will be updated by handlePlayerStateChange
        }
    }, [player, isPlaying]);

    const addToQueue = useCallback((video) => {
        setQueue(prev => [...prev, video]);
    }, []);

    const removeFromQueue = useCallback((index) => {
        setQueue(prev => prev.filter((_, i) => i !== index));
        if (currentQueueIndex >= queue.length - 1 && queue.length > 1) {
            setCurrentQueueIndex(prev => Math.max(0, prev - 1));
        }
    }, [queue.length, currentQueueIndex]);

    const clearQueue = useCallback(() => {
        setQueue([]);
        setCurrentQueueIndex(0);
    }, []);

    const toggleShuffle = useCallback(() => {
        setShuffle(prev => !prev);
    }, []);

    const setRepeat = useCallback((mode) => {
        setRepeatMode(mode);
    }, []);

    const seekTo = useCallback((seconds) => {
        if (player) {
            player.seekTo(seconds);
            setCurrentTime(seconds);
        }
    }, [player]);

    const value = {
        currentVideo,
        isPlaying,
        volume,
        player,
        currentTime,
        duration,
        queue,
        currentQueueIndex,
        repeatMode,
        shuffle,
        playVideo,
        togglePlay,
        handlePlayerReady,
        handlePlayerStateChange,
        setVolume,
        playNext,
        playPrevious,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        setRepeat,
        seekTo,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};

PlayerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { PlayerProvider };

import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import VideoCard from '../components/VideoCard';
import { FaHeart, FaPlus, FaPlay } from 'react-icons/fa';
import './Library.css';

const Library = () => {
    const { playVideo } = usePlayer();
    const [savedSongs, setSavedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);

    // Mock data for demonstration
    useEffect(() => {
        // Load saved songs from localStorage
        const saved = localStorage.getItem('youtube-music-saved');
        if (saved) {
            setSavedSongs(JSON.parse(saved));
        }

        // Load playlists from localStorage
        const playlistData = localStorage.getItem('youtube-music-playlists');
        if (playlistData) {
            setPlaylists(JSON.parse(playlistData));
        }

        // Load recently played from localStorage
        const recentData = localStorage.getItem('youtube-music-recent');
        if (recentData) {
            setRecentlyPlayed(JSON.parse(recentData));
        }
    }, []);

    const handleSaveSong = (video) => {
        const newSaved = [...savedSongs, video];
        setSavedSongs(newSaved);
        localStorage.setItem('youtube-music-saved', JSON.stringify(newSaved));
    };

    const handleRemoveSong = (videoId) => {
        const newSaved = savedSongs.filter(song => song.id !== videoId);
        setSavedSongs(newSaved);
        localStorage.setItem('youtube-music-saved', JSON.stringify(newSaved));
    };

    const handleCreatePlaylist = () => {
        const name = prompt('Enter playlist name:');
        if (name) {
            const newPlaylist = {
                id: Date.now().toString(),
                name: name,
                songs: [],
                createdAt: new Date().toISOString()
            };
            const newPlaylists = [...playlists, newPlaylist];
            setPlaylists(newPlaylists);
            localStorage.setItem('youtube-music-playlists', JSON.stringify(newPlaylists));
        }
    };

    const handleAddToPlaylist = (video, playlistId) => {
        const newPlaylists = playlists.map(playlist => {
            if (playlist.id === playlistId) {
                return {
                    ...playlist,
                    songs: [...playlist.songs, video]
                };
            }
            return playlist;
        });
        setPlaylists(newPlaylists);
        localStorage.setItem('youtube-music-playlists', JSON.stringify(newPlaylists));
    };

    const isSaved = (videoId) => {
        return savedSongs.some(song => song.id === videoId);
    };

    return (
        <div className="library-container">
            <div className="library-header">
                <h1 className="library-title">Your Library</h1>
                <div className="library-actions">
                    <button className="action-btn" onClick={handleCreatePlaylist}>
                        <FaPlus /> Create Playlist
                    </button>
                </div>
            </div>

            {/* Recently Played */}
            {recentlyPlayed.length > 0 && (
                <section className="library-section">
                    <h2 className="section-title">Recently Played</h2>
                    <div className="video-grid">
                        {recentlyPlayed.slice(0, 6).map(video => (
                            <div key={video.id} className="video-card-wrapper">
                                <VideoCard video={video} />
                                <div className="video-actions">
                                    <button 
                                        className="action-icon save-btn"
                                        onClick={() => isSaved(video.id) ? handleRemoveSong(video.id) : handleSaveSong(video)}
                                    >
                                        <FaHeart color={isSaved(video.id) ? '#ff0055' : '#ffffff'} />
                                    </button>
                                    <button 
                                        className="action-icon play-btn"
                                        onClick={() => playVideo(video)}
                                    >
                                        <FaPlay />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Saved Songs */}
            {savedSongs.length > 0 && (
                <section className="library-section">
                    <h2 className="section-title">Liked Songs</h2>
                    <div className="video-grid">
                        {savedSongs.slice(0, 8).map(video => (
                            <div key={video.id} className="video-card-wrapper">
                                <VideoCard video={video} />
                                <div className="video-actions">
                                    <button 
                                        className="action-icon save-btn"
                                        onClick={() => handleRemoveSong(video.id)}
                                    >
                                        <FaHeart color="#ff0055" />
                                    </button>
                                    <button 
                                        className="action-icon play-btn"
                                        onClick={() => playVideo(video)}
                                    >
                                        <FaPlay />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Playlists */}
            {playlists.length > 0 && (
                <section className="library-section">
                    <h2 className="section-title">Your Playlists</h2>
                    <div className="playlists-grid">
                        {playlists.map(playlist => (
                            <div key={playlist.id} className="playlist-card">
                                <div className="playlist-header">
                                    <h3>{playlist.name}</h3>
                                    <span className="playlist-count">{playlist.songs.length} songs</span>
                                </div>
                                <div className="playlist-songs">
                                    {playlist.songs.slice(0, 3).map(song => (
                                        <div key={song.id} className="playlist-song">
                                            <span className="song-title">{song.snippet?.title || 'Unknown Title'}</span>
                                            <span className="song-artist">{song.snippet?.channelTitle || 'Unknown Artist'}</span>
                                        </div>
                                    ))}
                                    {playlist.songs.length > 3 && (
                                        <div className="more-songs">
                                            +{playlist.songs.length - 3} more
                                        </div>
                                    )}
                                </div>
                                <div className="playlist-actions">
                                    <button 
                                        className="playlist-play-btn"
                                        onClick={() => playlist.songs[0] && playVideo(playlist.songs[0])}
                                    >
                                        <FaPlay /> Play
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {savedSongs.length === 0 && playlists.length === 0 && recentlyPlayed.length === 0 && (
                <div className="empty-library">
                    <div className="empty-icon">🎵</div>
                    <h3>Your library is empty</h3>
                    <p>Start listening to music and it will appear here</p>
                </div>
            )}
        </div>
    );
};

export default Library;
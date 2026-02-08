import React from 'react';
import { FaPlay } from "react-icons/fa";
import './VideoCard.css';

const VideoCard = ({ video }) => {
    // Mock data handling if video prop is missing details
    const { 
        id, 
        snippet = {}, 
    } = video || {};

    const {
        title = "Unknown Title",
        channelTitle = "Unknown Artist",
        thumbnails = { high: { url: 'https://via.placeholder.com/320x180' } }
    } = snippet;

    // Helper to decode HTML entities in title
    const decodeEntities = (text) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = text;
        return txt.value;
    }

    return (
        <div className="video-card">
            <div className="thumbnail-container">
                <img src={thumbnails.high?.url || thumbnails.medium?.url} alt={title} className="thumbnail" />
                <div className="play-overlay">
                    <FaPlay className="play-icon" />
                </div>
            </div>
            <div className="info-container">
                <h3 className="video-title">{decodeEntities(title)}</h3>
                <p className="channel-title">{channelTitle}</p>
            </div>
        </div>
    );
};

export default VideoCard;

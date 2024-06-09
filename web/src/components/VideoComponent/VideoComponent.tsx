"use client";
import React, { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from './VideoComponent.module.scss'; // Using SCSS modules

interface VideoProps {
    thumbnailUrl: string;
    videoId: string;
}

const VideoComponent = ({ thumbnailUrl, videoId }: VideoProps) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const onReady: YouTubeProps['onReady'] = (event) => {
        event.target.playVideo();
    };

    const opts: YouTubeProps['opts'] = {
        width: '100%',
        height: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className={styles.videoContainer}>
            {!isPlaying && (
                <div className={styles.thumbnailContainer} onClick={() => setIsPlaying(true)}>
                    <img src={thumbnailUrl} alt="Video Thumbnail" className={styles.thumbnail} />
                    <button className={styles.playButton}></button>
                </div>
            )}
            {isPlaying && (
                <YouTube videoId={videoId} opts={opts} onReady={onReady} className={styles.video} />
            )}
        </div>
    );
};

export default VideoComponent;

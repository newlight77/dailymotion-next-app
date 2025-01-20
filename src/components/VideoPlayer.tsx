import React from 'react';

interface VideoPlayerProps {
    videoId: string;
    videoTitle: string,
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, videoTitle }) => {
    return (
        <div className="video-player pt-12 w-full h-full">
            <iframe allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture; web-share"
                className="dailymotion-player"
                src={`https://geo.dailymotion.com/player.html?video=${videoId}`}
                title={videoTitle}
                style={{ width: '100%',  height: '64vh'}}
            >
            </iframe>
        </div>
    );
};

export default VideoPlayer;
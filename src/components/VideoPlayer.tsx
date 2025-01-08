import React from 'react';

interface VideoPlayerProps {
    videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    return (
        <div className="video-player">
            <video controls autoPlay style={{ width: '100%', height: '100%' }}>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
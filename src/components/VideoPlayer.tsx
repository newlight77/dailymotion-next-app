import React from 'react';
// import { IFrame } from '@iframe-resizer/react';

interface VideoPlayerProps {
    videoId: string;
    videoTitle: string,
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, videoTitle }) => {
    return (
        <div className="video-player h-full w-full">
            {/* <video controls autoPlay style={{ width: '100%', height: '100%' }}>
                <source src={`${videoUrl}`} />
                Your browser does not support the video tag.
            </video> */}
            <iframe allowFullScreen
                    loading="eager"
                    // sandbox='allow-scripts allow-modal'
                    allow="autoplay; fullscreen; picture-in-picture; web-share"
                    // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="dailymotion-player"
                    src={`https://geo.dailymotion.com/player.html?video=${videoId}`}
                    title={videoTitle}
                    height="865px"
                    width="1600px"
                    >
            </iframe>
        </div>
    );
};

export default VideoPlayer;
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// import VideoPlayer from '../components/VideoPlayer';
import { VideoResponse } from '../service/getVideo';

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [video, setVideo] = React.useState<VideoResponse['video'] | null>({url: `https://www.dailymotion.com/video/${id}`});

    console.log('videoId', id);
    useEffect(() => {
        console.log('videoId', id);
        setVideo({url: `https://www.dailymotion.com/video/${id}`});
    }, [id]);
    // const video = {url: `https://www.dailymotion.com/video/${id}`};

    return (
        <div>
            {/* {video ? <VideoPlayer videoUrl={video.url} /> : <div>Loading...</div>} */}
            {video ? <Link to={video.url}>{id}</Link> : <div>Loading...</div>}
        </div>
    );
};

export default VideoPage;

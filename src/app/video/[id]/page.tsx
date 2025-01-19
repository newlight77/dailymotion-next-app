"use client"
import React, { useEffect } from 'react';
import VideoPlayer from '../../../components/VideoPlayer';
import { getVideo, VideoResponse } from '../../../service/getVideo';
import { useParams } from 'next/navigation';


type Video = {
    id: string
    title: string
}

// type ParamsType = {
//     params: Promise<{ id: string }>
// }

// const VideoPage: React.FC<ParamsType> = ({ params }: ParamsType) => {
    // const { id } = React.use(params);
const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();
    const [video, setVideo] = React.useState<Video>();

    const onSuccess = (videoResponse: VideoResponse): void => {
        console.log('on success', videoResponse);
        if (videoResponse.id && videoResponse.title) {
            setVideo({id: videoResponse.id, title: videoResponse.title});
        }
    }

    useEffect(() => {
        console.log('params.id', id);
        getVideo(id, onSuccess);
    }, [id]);

    return (
        <div className='container'>
            {video ? <VideoPlayer videoId={video.id} videoTitle={video.title} /> : <div>Loading...</div>}
        </div>
    );
};

export default VideoPage;

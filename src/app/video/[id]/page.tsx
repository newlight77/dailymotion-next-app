"use client"
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getVideo } from '@/bounded-contexts/video-search-context/adapter/getVideo-adapter';
import VideoPlayer from '@/components/organisms/VideoPlayer';
import { VideoType } from '@/bounded-contexts/video-search-context/domain/model/anime';


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

    const onSuccess = (video: VideoType): void => {
        console.log('on success', video);
        if (video) {
            setVideo({id: video.videoId, title: video.title});
        }
    }

    useEffect(() => {
        console.log('params.id', id);
        getVideo(id, onSuccess);
    }, [id]);

    return (
        <div className='w-full'>

            {video ?
                <div>
                    <h3 className='title text-3xl p-1 md:p-4 capitalize'>{video.title}</h3>
                    <VideoPlayer videoId={video.id} videoTitle={video.title} />
                </div>
                :
                <div>Loading...</div>}
        </div>
    );
};

export default VideoPage;

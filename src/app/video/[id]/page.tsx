"use client"
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import VideoPlayer from '@/components/organisms/VideoPlayer';
import { useSearchVideos } from '@/donghua-context/videosearch-feature';


type Video = {
    id: string
    title: string
}

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();
    const [video, setVideo] = React.useState<Video>();
    const { findById } = useSearchVideos();

    useEffect(() => {
        console.log('params.id', id);
        findById(id).then((v) => {
            if (v) setVideo({id: v.videoId, title: v.title});
        });
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

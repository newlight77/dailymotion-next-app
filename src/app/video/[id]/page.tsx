"use client"
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import VideoPlayer from '@/components/organisms/VideoPlayer';
import { useSearchVideos } from '@/bounded-contexts/video-search-context/hooks';


type Video = {
    id: string
    title: string
}

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();
    const [video, setVideo] = React.useState<Video>();
    const { found, findById } = useSearchVideos();

    useEffect(() => {
        console.log('params.id', id);
        getById(id);
    }, [id]);

    const getById = async (id: string) => {
        await findById(id);
        if (found) setVideo({id: found.videoId, title: found.title});
    }

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

"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import AnimeDetail from '@/bounded-contexts/video-search-context/view/animelist/AnimeDetail';


const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();

    return (
        <div className='w-full'>
            <AnimeDetail id={id}></AnimeDetail>
        </div>
    );
};

export default VideoPage;

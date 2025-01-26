"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AnimeType } from '@/search-context/search-provider/domain/anime';
import { getAnime } from '@/search-context/search-provider/adapter/getAnime-adapter';


const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string}>();
    const [anime, setAnime] = React.useState<AnimeType>();

    useEffect(() => {
        console.log('params.id', id);
        getAnime(id).then((anime) => {
            setAnime(anime);
        });
    }, [id]);

    return (
        <div className='w-full'>

            {anime ?
                <div className='m-auto p-2'>
                    <Image className='anime w-96 m-auto'
                        src={anime.thumbnail}
                        alt={anime.title}
                        width={480}
                        height={480} />
                    <h3 className='title text-3xl p-1 md:p-4 capitalize'>{anime.title}</h3>
                    <div className='p-1 md:px-4'>{anime.originalTitle}</div>
                    <div className='p-1 md:px-4'>{anime.subtitle}</div>
                    <div className='p-1 md:px-4'>{anime.summary}</div>
                    <div className='p-1 md:px-4'>publishedBy: {anime.publishedBy}</div>
                    <div className='p-1 md:px-4'>type: {anime.type}</div>
                    <div className='p-1 md:px-4'>status: {anime.status}</div>
                    <div className='p-1 md:px-4'>lastEpisode: {anime.lastEpisode}</div>
                    <div className='p-1 md:px-4'>totalEpisodes: {anime.totalEpisodes}</div>
                </div>
                :
                <div>Loading...</div>}
        </div>
    );
};

export default VideoPage;

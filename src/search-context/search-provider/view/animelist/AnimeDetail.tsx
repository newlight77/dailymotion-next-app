"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { AnimeType } from '@/search-context/search-provider/domain/anime';
import { getAnime } from '@/search-context/search-provider/adapter/getAnime-adapter';
// import { useAnimelist } from '../../hooks/AnimeListProvider';

type Props = {
    id: string
    children?: React.ReactNode
}

const AnimeDetail: React.FC<Props> = ({id}) => {
    // const { findById } = useAnimelist();

    const [item, setAnime] = React.useState<AnimeType>();

    useEffect(() => {
        console.log('params.id', id);
        getAnime(id).then((anime) => { // todo move to storage provider : add findById and
            setAnime(anime);
        });
    }, [id]);

    return (
        <div className='w-full'>

            {item ?
                <div className='flex flex-wrap p-2'>
                    <Image className='anime md:w-1/2 md:max-w-screen-sm center justify-center items-center'
                        src={item.thumbnail}
                        alt={item.title}
                        width={480}
                        height={480} />
                    <div className='flex flex-col px-2 md:w-1/2'>
                        <h3 className='title text-3xl p-4 capitalize'>{item.title}</h3>
                        <div className='p-1 md:px-4'>{item.originalTitle}</div>
                        <div className='p-1 md:px-4'>{item.subtitle}</div>
                        <div className='p-1 md:px-4'>{item.summary}</div>
                        <div className='grid grid-cols-2 gap-2 p-4 md:px-4'>
                            <div className='p-1 md:px-4'>type: {item.type}</div>
                            <div className='p-1 md:px-4'>status: {item.status}</div>
                            <div className='p-1 md:px-4'>published by: {item.publishedBy}</div>
                            <div className='p-1 md:px-4'>published: {item.publishedBy}</div>
                            <div className='p-1 md:px-4'>last episode: {item.lastEpisode}</div>
                            {/* <div className='p-1 md:px-4'>number of episodes: {item.totalEpisodes}</div> */}
                        </div>
                    </div>
                </div>
                :
                <div>Loading...</div>}
        </div>
    );
};

export default AnimeDetail;

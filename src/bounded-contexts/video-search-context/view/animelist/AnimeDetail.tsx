"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimeType } from '@/bounded-contexts/video-search-context/domain/model/anime';
import { useAnimelist } from '../../hooks/AnimeListProvider';
import Modal from '@/components/molecules/Modal';
import AnimeEdit from './AnimeEdit';
import Link from 'next/link';

type Props = {
    id: string
    children?: React.ReactNode
}

const AnimeDetail: React.FC<Props> = ({id}) => {
    const { adapter } = useAnimelist();

    const [anime, setAnime] = useState<AnimeType>();
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        console.log('params.id', id);
        adapter.findById(id).then((a) => { // todo move to storage provider : add findById and
            setAnime(a);
        });
    }, [id]);

    function toggleEditModal(): void {
        setEditModal(editModal ? false : true);
    }

    return (
        <div className='w-full'>
            <div id="modal-root"></div>
            { editModal && anime &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 ' onClose={() => setEditModal(false)} title={anime.title}>
                    <AnimeEdit editedAnime={anime}></AnimeEdit>
                </Modal>
            }

            {anime ?
                <div className='flex flex-wrap p-2'>
                    <Image className='anime md:w-1/2 md:max-w-screen-sm center justify-center items-center'
                        src={anime.thumbnail}
                        alt={anime.title}
                        width={480}
                        height={480} />
                    <div className='flex flex-col px-2 md:w-1/2'>
                        <h3 className='title text-3xl p-4 capitalize'>{anime.title}</h3>
                        <div className='p-1 md:px-4'>{anime.originalTitle}</div>
                        <div className='p-1 md:px-4'>{anime.subtitle}</div>
                        <div className='p-1 md:px-4'>{anime.summary}</div>
                        <div className='grid grid-cols-2 gap-2 p-4 md:px-4'>
                            <div className='p-1 md:px-4'>type: {anime.type}</div>
                            <div className='p-1 md:px-4'>status: {anime.status}</div>
                            <div className='p-1 md:px-4'>published by: {anime.publishedBy}</div>
                            <div className='p-1 md:px-4'>published: {anime.publishedBy}</div>
                            <div className='p-1 md:px-4'>last episode: {anime.lastEpisode}</div>
                            {/* <div className='p-1 md:px-4'>number of episodes: {item.totalEpisodes}</div> */}
                        </div>
                    </div>
                    <Link href={''} className="pr-4" onClick={toggleEditModal}>edit</Link>
                </div>
                :
                <div>Loading...</div>}
        </div>
    );
};

export default AnimeDetail;

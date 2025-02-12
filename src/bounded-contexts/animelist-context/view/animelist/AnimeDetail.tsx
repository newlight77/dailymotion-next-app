"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaHeartCirclePlus, FaMagnifyingGlass, FaPenToSquare, FaThumbtack } from 'react-icons/fa6';
import Modal from '@/components/molecules/Modal';
import { useIsMounted } from '@/shared/useIsMounted';
import { useFavorites } from '@/bounded-contexts/user-preferences-context';
import { useFollowedAnimes } from '@/bounded-contexts/user-preferences-context';
import { AnimeType } from '../../domain';
import { useAnimelist } from '../../hooks';
import { AnimeEdit } from './AnimeEdit';
import Link from 'next/link';

type Props = {
    id: string
    mode?: string
    children?: React.ReactNode
}

export const AnimeDetail: React.FC<Props> = ({id, mode}) => {
    const { usecase } = useAnimelist();
    const useFavorite = useFavorites();
    const useFollowedAnime = useFollowedAnimes();

    const isMounted = useIsMounted();
    const [anime, setAnime] = useState<AnimeType>();
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    useEffect(() => {
        // console.log('AnimeDetail useEffect params:', id, mode);
        usecase.findById(id).then((a) => { // todo move to storage provider : add findById and
            // console.log('AnimeDetail useEffect params:', id, a);
            if (isMounted()) setAnime(a);
        });

        if (mode === 'edit') toggleEditModal()
    }, [id]);

    useEffect(() => {

    }, [useFavorite.remove, useFollowedAnime.remove])

    function toggleEditModal(): void {
        setEditModal(editModal ? false : true);
    }

    const handleAnimeUpdate = (anime: AnimeType) => {
        setAnime(anime);
    }

    const handleAddToFavorites = async (anime: AnimeType) => {
        if (isFavorite(anime)) {
            useFavorite.remove(anime.uid)
        } else {
            useFavorite.addOrUpdate({uid: anime.uid, animeId: anime.uid, title: anime.title, subtitle: anime.subtitle, originalTitle: anime.originalTitle, order: 1});
        }
    }

    const handleFollowAnime = async (anime: AnimeType) => {
        // console.log('handleFollowAnime', anime)
        // TODO : follow anime, add list of following anime
        // TODO: display followed animes on following page
        if (isFollowed(anime)) {
            useFollowedAnime.remove(anime.uid)
        } else {
            useFollowedAnime.addOrUpdate({
                uid: anime.uid,
                animeId: anime.uid,
                title: anime.title,
                subtitle: anime.subtitle,
                originalTitle: anime.originalTitle,
                lastEpisode: anime.lastEpisode,
                updatedAt: anime.updatedAt
            })
        }
    }

    const isFollowed = (anime: AnimeType): boolean => {
        const results = useFollowedAnime.items?.filter(f => f.title === anime.title)
        return results?.length === 1
    }

    const isFavorite = (anime: AnimeType): boolean => {
        const results = useFavorite.items?.filter(f => f.title === anime.title)
        return results?.length === 1
    }

    const keywords = (anime: AnimeType) => encodeURIComponent(`${anime.title} ${anime.lastEpisode ? anime.lastEpisode : ''}`)

    const handleAdd = async (anime: AnimeType) => {
        try {
            setEditModal(false)
            setAddModal(true)
            setAnime(anime);
        } catch (error) {
            console.error('Failed to add anime:', error);
        }
    }

    return (
        <div className='w-full'>
            <div id="modal-root"></div>
            { editModal && anime &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40' onClose={() => setEditModal(false)} title={anime.title}>
                    <AnimeEdit editedAnime={anime} mode={'edit'} onEdit={handleAnimeUpdate} onCopy={handleAdd}></AnimeEdit>
                </Modal>
            }
            { addModal && anime &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40' onClose={() => setAddModal(false)} title={`Copy of ${anime.title}`}>
                    <AnimeEdit editedAnime={anime} mode={'add'}></AnimeEdit>
                </Modal>
            }

            {anime ?
                <div className='flex flex-wrap p-2'>
                    <div className='grid grid-rows-4 pt-5 absolute translate-y-8'>
                        <Link href={`/?keywords=${keywords(anime)}`} className="searchlink gap-2 p-4">
                            <FaMagnifyingGlass size={36} className="p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant"/>
                        </Link>
                        <Link href={''} className='followinglink gap-2 p-4' onClick={() => handleFollowAnime(anime)}>
                            <FaThumbtack size={36} className={`${isFollowed(anime) ? 'text-tertiary hover:text-primary' : ''} p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant`}/>
                        </Link>
                        <Link href={''} className='favoritelink gap-2 p-4' onClick={() => handleAddToFavorites(anime)}>
                            <FaHeartCirclePlus size={36} className={`${isFavorite(anime) ? 'text-tertiary hover:text-primary' : ''} p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant`}/>
                        </Link>
                        { !editModal &&
                            <Link href={''} className="gap-2 p-4" onClick={toggleEditModal}>
                                <FaPenToSquare size={36} className="p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant"/>
                            </Link>
                        }
                    </div>

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
                            <div className='p-1 md:px-4'>update every: { anime.updateDays }</div>
                            {/* <div className='p-1 md:px-4'>published by: {anime.publishedBy}</div> */}
                            {/* <div className='p-1 md:px-4'>published: {anime.publishedAt.toISOString().split('T')[0]}</div> */}
                            <div className='p-1 md:px-4'>last episode: {anime.lastEpisode}</div>
                            {/* <div className='p-1 md:px-4'>number of episodes: {item.totalEpisodes}</div> */}
                        </div>
                    </div>
                </div>
                :
                <div>Loading...</div>
            }
        </div>
    );
};

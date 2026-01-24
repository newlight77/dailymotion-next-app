"use client"
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaMagnifyingGlass, FaPenToSquare, FaThumbtack } from 'react-icons/fa6';
import Modal from '@/components/molecules/Modal';
import { useIsMounted } from '@/core/core-lib/shared/useIsMounted';
import { useFollowedAnimes } from '@/donghua-context/user-preferences-feature';
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
    const useAnimes = useAnimelist();
    const useFollowedAnime = useFollowedAnimes();

    const isMounted = useIsMounted();
    const [anime, setAnime] = useState<AnimeType>();
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const toggleEditModal = useCallback((): void => {
        setEditModal(prev => !prev);
    }, []);

    useEffect(() => {
        // console.log('AnimeDetail useEffect params:', id, mode);
        useAnimes.findById(id).then((a) => { // todo move to storage provider : add findById and
            // console.log('AnimeDetail useEffect params:', id, a);
            if (isMounted()) setAnime(a);
        });

        if (mode === 'edit') setEditModal(true)
    }, [id, isMounted, mode, useAnimes]);

    const handleAnimeUpdate = (anime: AnimeType) => {
        setAnime(anime);
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
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40 inset-20 items-center' onClose={() => setEditModal(false)} title={anime.title}>
                    <AnimeEdit editedAnime={anime} mode={'edit'} onEdit={handleAnimeUpdate} onCopy={handleAdd}></AnimeEdit>
                </Modal>
            }
            { addModal && anime &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40 inset-20 items-center' onClose={() => setAddModal(false)} title={`Copy of ${anime.title}`}>
                    <AnimeEdit editedAnime={anime} mode={'add'}></AnimeEdit>
                </Modal>
            }

            {anime ?
                <div className='flex flex-wrap p-2'>
                    <div className='grid grid-rows-4 pt-5 absolute translate-y-8'>
                        <Link href={`/?keywords=${keywords(anime)}`} className="searchlink gap-2 p-4">
                            <FaMagnifyingGlass size={36} className="p-2 bg-secondary-variant rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
                        </Link>
                        <Link href={''} about="follow anime" aria-label="follow anime" className='followinglink gap-2 p-4' onClick={() => handleFollowAnime(anime)}>
                            <FaThumbtack aria-label="follow anime" size={36} className={`${isFollowed(anime) ? 'text-tertiary hover:text-primary' : ''} p-2 bg-secondary-variant rounded-md border border-tertiary-variant outline outline-tertiary-variant`}/>
                        </Link>
                        { !editModal &&
                            <Link href={''} className="gap-2 p-4" onClick={toggleEditModal}>
                                <FaPenToSquare size={36} className="p-2 bg-secondary-variant rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
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
                        {anime.originalTitle && <div className='p-1 md:px-4'><strong>Original Title:</strong> {anime.originalTitle}</div>}
                        {anime.subtitle && <div className='p-1 md:px-4'><strong>Subtitle:</strong> {anime.subtitle}</div>}
                        <div className='p-1 md:px-4'><strong>Summary:</strong> {anime.summary}</div>

                        <div className='grid grid-cols-2 gap-2 p-4 md:px-4'>
                            <div className='p-1 md:px-4'><strong>UID:</strong> {anime.uid}</div>
                            <div className='p-1 md:px-4'><strong>Type:</strong> {anime.type}</div>
                            <div className='p-1 md:px-4'><strong>Status:</strong> {anime.status}</div>
                            <div className='p-1 md:px-4'><strong>Studio:</strong> {anime.studio}</div>
                            <div className='p-1 md:px-4'><strong>Published By:</strong> {anime.publishedBy}</div>
                            <div className='p-1 md:px-4'><strong>Update Days:</strong> {anime.updateDays || 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Published At:</strong> {anime.publishedAt ? new Date(anime.publishedAt).toLocaleDateString() : 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Release At:</strong> {anime.releaseAt ? new Date(anime.releaseAt).toLocaleDateString() : 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Updated At:</strong> {anime.updatedAt ? new Date(anime.updatedAt).toLocaleDateString() : 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Thumbnail Filename:</strong> {anime.thumbnailFilename || 'N/A'}</div>
                        </div>

                        <div className='grid grid-cols-2 gap-2 p-4 md:px-4 border-t border-gray-300 mt-4'>
                            <div className='p-1 md:px-4'><strong>First Episode of Season (Global):</strong> {anime.firstSeasonEpisode ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Last Episode of Season (Season #):</strong> {anime.lastSeasonEpisode ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Total Episodes of Season:</strong> {anime.totalSeasonEpisodes ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Last Episode (Global):</strong> {anime.lastEpisode ?? 'N/A'}</div>
                            <div className='p-1 md:px-4'><strong>Total Episodes:</strong> {anime.totalEpisodes ?? 'N/A'}</div>
                        </div>
                    </div>
                </div>
                :
                <div>Loading...</div>
            }
        </div>
    );
};

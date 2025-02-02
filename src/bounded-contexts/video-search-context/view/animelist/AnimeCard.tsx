import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaUserPlus, FaPenToSquare } from 'react-icons/fa6';
import { AnimeType } from '../../domain/model/anime';
import Modal from '@/components/molecules/Modal';
import AnimeEdit from './AnimeEdit';


interface AnimeCardProps {
    anime: AnimeType,
    onAddToFavorite: (anime: AnimeType) => void,
    onFollowAnime: (anime: AnimeType) => void,
    className?: string
}

const AnimeCard: React.FC<AnimeCardProps> = ({anime, onAddToFavorite, onFollowAnime, className}) => {

    const [editModal, setEditModal] = useState(false);

    const handleAddToFavorites = (anime: AnimeType) => {
        const a = {
            uid: anime.uid,
            type: anime.type,
            status: anime.status,
            thumbnail: anime.thumbnail,
            title: anime.title,
            summary: anime.summary,
            studio: anime.studio,
            publishedAt: anime.publishedAt,
            publishedBy: anime.publishedBy,
            releaseAt: anime.releaseAt,
            updateAt: anime.updateAt,
            episode: anime.lastEpisode,
            totalEpisodes: anime.totalEpisodes,
            originalTitle: anime.originalTitle,
            subtitle: anime.subtitle,
        }
        onAddToFavorite(a);
    }

    const handleFollowAnime = (anime: AnimeType) => {
        const a = {
            uid: anime.uid,
            type: anime.type,
            status: anime.status,
            thumbnail: anime.thumbnail,
            title: anime.title,
            summary: anime.summary,
            studio: anime.studio,
            publishedAt: anime.publishedAt,
            publishedBy: anime.publishedBy,
            releaseAt: anime.releaseAt,
            updateAt: anime.updateAt,
            episode: anime.lastEpisode,
            totalEpisodes: anime.totalEpisodes,
            originalTitle: anime.originalTitle,
            subtitle: anime.subtitle,
        }
        onFollowAnime(a);
    }

    function toggleEditModal(): void {
        setEditModal(editModal ? false : true);
    }

    return (
        <div className={`${className} p-2 md:hover:border border-gold`}>

            <div id="modal-root"></div>
            { editModal &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 ' onClose={() => setEditModal(false)} title={anime.title}>
                    <AnimeEdit editedAnime={anime}></AnimeEdit>
                </Modal>
            }

            <div className='grid grid-cols-2 pt-5 items-center absolute'>
                <Link className='followinglink ml-4 flex items-center gap-2 pr-4'
                    href={''}
                    onClick={() => handleFollowAnime(anime)}>
                    <FaUserPlus size={32} className="p-1 hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                </Link>
                <Link href={''} className="pr-4" onClick={toggleEditModal}>
                    <FaPenToSquare size={32} className="p-1 hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                </Link>
            </div>

            <Link className='view'
                href={`/anime/${anime.uid}`}
                onClick={() => handleAddToFavorites(anime)}>
                <Image className='video max-h-screen h-2/3'
                    src={anime.thumbnail || ''}
                    alt={anime.title}
                    width={480}
                    height={480} />
            </Link>
            <div className=''>
                <Link className='titlelink'
                    href={`/anime/${anime.uid}`}
                    onClick={() => handleAddToFavorites(anime)}>
                    <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{anime.title}</div>
                </Link>
                <div className='description text-sm text-wrap pt-1 h-10 m-2'>{`${anime.summary.substring(0, 140)} ...`}</div>
                <div className='content p-2'>
                    <div className='grid grid-cols-2 pt-4 gap-2 items-center'>
                        <div className='ml-4'>published by: {anime.publishedBy}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AnimeCard;
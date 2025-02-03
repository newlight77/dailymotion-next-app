import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaThumbtack, FaPenToSquare, FaHeartCirclePlus } from 'react-icons/fa6';
import { AnimeType } from '../../domain/model/anime';


interface AnimeCardProps {
    anime: AnimeType,
    onAddToFavorite: (anime: AnimeType) => void,
    onFollowAnime: (anime: AnimeType) => void,
    className?: string
}

const AnimeCard: React.FC<AnimeCardProps> = ({anime, onAddToFavorite, onFollowAnime, className}) => {

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

    return (
        <div className={`${className} p-2 md:hover:border border-gold`}>

            <div className='grid grid-cols-3 pt-5 items-center absolute'>
                <Link className='followinglink items-center gap-2 px-4'
                    href={''}
                    onClick={() => handleFollowAnime(anime)}>
                    <FaThumbtack size={32} className="p-1 hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                </Link>
                <Link className='favoritelink items-center gap-2 px-4'
                    href={''}
                    onClick={() => handleAddToFavorites(anime)}>
                    <FaHeartCirclePlus size={32} className="p-1 hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                </Link>
                <Link href={`/anime/${anime.uid}?mode=edit`} className="editlink items-center gap-2 px-4">
                    <FaPenToSquare size={32} className="p-1 hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                </Link>
            </div>

            <Link className='view'
                href={`/anime/${anime.uid}`}>
                <Image className='video max-h-screen h-2/3'
                    src={anime.thumbnail || ''}
                    alt={anime.title}
                    width={480}
                    height={480} />
            </Link>
            <div className=''>
                <Link className='titlelink'
                    href={`/anime/${anime.uid}`}>
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
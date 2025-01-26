import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaUserPlus } from 'react-icons/fa6';
import { AnimeType } from '../../domain/anime';


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
            releaseDate: anime.releaseDate,
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
            releaseDate: anime.releaseDate,
            updateAt: anime.updateAt,
            episode: anime.lastEpisode,
            totalEpisodes: anime.totalEpisodes,
            originalTitle: anime.originalTitle,
            subtitle: anime.subtitle,
        }
        onFollowAnime(a);
    }

    return (
        <div className={`${className} m-2 md:hover:border border-gold`}>
            <Link className='view'
                href={`/anime/${anime.uid}`}
                target="_blank"
                onClick={() => handleAddToFavorites(anime)}>
                <Image className='video w-96'
                    src={anime.thumbnail || ''}
                    alt={anime.title}
                    width={480}
                    height={480} />
            </Link>
            <Link className='titlelink'
                href={`/anime/${anime.uid}`}
                target="_blank"
                onClick={() => handleAddToFavorites(anime)}>
                <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{anime.title}</div>
            </Link>
            <div className='description text-sm text-wrap pt-1 h-10 m-2 hover:h-fit'>{anime.summary}</div>
            <div className='content p-2'>
                <div className='grid grid-cols-2 pt-4 gap-2 items-center'>
                    <div className='ml-4'>published by: {anime.publishedBy}</div>
                </div>
            </div>
            <div className='grid grid-cols-2 pt-5 items-center'>
                <Link className='followinglink ml-4 flex items-center gap-2'
                    href={''}
                    onClick={() => handleFollowAnime(anime)}>
                    <FaUserPlus size={20} className="hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                </Link>
            </div>
        </div>
    );
};

export default AnimeCard;
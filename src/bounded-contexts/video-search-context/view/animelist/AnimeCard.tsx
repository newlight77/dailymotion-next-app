import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaThumbtack, FaPenToSquare, FaHeartCirclePlus, FaMagnifyingGlass } from 'react-icons/fa6';
import { AnimeType } from '../../domain/model/anime';
import { useFavorites } from '../../hooks';


interface AnimeCardProps {
    anime: AnimeType,
    className?: string
}

const AnimeCard: React.FC<AnimeCardProps> = ({anime, className}) => {
    const useFavorite = useFavorites();

    const handleAddToFavorites = async (anime: AnimeType) => {
        useFavorite.addOrUpdate({uid: crypto.randomUUID().toString(), title: anime.title, subtitle: anime.subtitle, originalTitle: anime.originalTitle, order: 1});
    }

    const handleFollowAnime = async (anime: AnimeType) => {
        console.log('handleFollowAnime', anime)
        // TODO : follow anime, add list of following anime
        // TODO: display followed animes on following page
    }

    return (
        <div className={`${className} p-2 md:hover:border border-gold`}>

            <div className='grid grid-rows-4 pt-5 absolute translate-y-8'>
                <Link href={`/?keywords=${anime.title} ${anime.originalTitle ? anime.lastEpisode : ''}`} className="searchlink gap-2 p-4">
                    <FaMagnifyingGlass size={36} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant border border-tertiaryVariant outline outline-tertiaryVariant"/>
                </Link>
                <Link href={''} className='followinglink gap-2 p-4' onClick={() => handleFollowAnime(anime)}>
                    <FaThumbtack size={36} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant border border-tertiaryVariant outline outline-tertiaryVariant"/>
                </Link>
                <Link href={''} className='favoritelink gap-2 p-4' onClick={() => handleAddToFavorites(anime)}>
                    <FaHeartCirclePlus size={36} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant border border-tertiaryVariant outline outline-tertiaryVariant"/>
                </Link>
                <Link href={`/anime/${anime.uid}?mode=edit`} className="editlink gap-2 p-4">
                    <FaPenToSquare size={36} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant border border-tertiaryVariant outline outline-tertiaryVariant"/>
                </Link>
            </div>

            <Link className='view'
                href={`/anime/${anime.uid}`}>
                <Image className='video max-h-screen h-3/4'
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
                <div className='content pt-12'>
                    <div className='grid grid-cols-2 gap-2 items-center'>
                        <div className='ml-2'>published by: {anime.publishedBy}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AnimeCard;
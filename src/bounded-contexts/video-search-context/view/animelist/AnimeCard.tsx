import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaThumbtack, FaPenToSquare, FaHeartCirclePlus, FaMagnifyingGlass } from 'react-icons/fa6';
import { AnimeType } from '../../domain/model/anime';
import { useFavorites } from '../../hooks';
import { useFollowedAnimes } from '../../hooks/FollowedAnimesProvider';


interface AnimeCardProps {
    anime: AnimeType,
    className?: string
}

const AnimeCard: React.FC<AnimeCardProps> = ({anime, className}) => {
    const useFavorite = useFavorites();
    const useFollowedAnime = useFollowedAnimes();

    useEffect(() => {

    }, [useFavorite.remove, useFollowedAnime.remove])

    const handleAddToFavorites = async (anime: AnimeType) => {
        if (isFavorite(anime)) {
            useFavorite.remove(anime.uid)
        } else {
            useFavorite.addOrUpdate({uid: anime.uid, title: anime.title, subtitle: anime.subtitle, originalTitle: anime.originalTitle, order: 1});
        }
    }

    const handleFollowAnime = async (anime: AnimeType) => {
        console.log('handleFollowAnime', anime)
        // TODO : follow anime, add list of following anime
        // TODO : display followed animes on following page

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
                updateAt: anime.updateAt
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

    return (
        <div className={`${className} p-2 md:hover:border border-gold rounded-md`}>
            <div className='relative'>
                <div className='grid grid-rows-4 pt-5 absolute translate-y-8'>
                    <Link href={`/?keywords=${anime.title} ${anime.originalTitle ? anime.lastEpisode : ''}`} className="searchlink gap-2 p-4">
                        <FaMagnifyingGlass size={36} className="p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant"/>
                    </Link>
                    <Link href={''} className='followinglink gap-2 p-4' onClick={() => handleFollowAnime(anime)}>
                        <FaThumbtack size={36} className={`${isFollowed(anime) ? 'text-tertiary hover:text-primary' : ''} p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant`}/>
                    </Link>
                    <Link href={''} className='favoritelink gap-2 p-4' onClick={() => handleAddToFavorites(anime)}>
                        <FaHeartCirclePlus size={36} className={`${isFavorite(anime) ? 'text-tertiary hover:text-primary' : ''} p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant`}/>
                    </Link>
                    <Link href={`/anime/${anime.uid}?mode=edit`} className="editlink gap-2 p-4">
                        <FaPenToSquare size={36} className="p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant"/>
                    </Link>
                </div>

                <Link className='thumbnaillink' href={`/anime/${anime.uid}`}>
                    <Image className='anime max-h-screen h-128' src={anime.thumbnail || ''} alt={anime.title} width={480} height={480} />
                </Link>
            </div>
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
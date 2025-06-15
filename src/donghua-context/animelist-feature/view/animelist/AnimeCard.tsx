import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaThumbtack, FaPenToSquare, FaMagnifyingGlass, FaFileCirclePlus } from 'react-icons/fa6';
import { AnimeType } from '../../domain/model';
import { useFollowedAnimes } from '@/donghua-context/user-preferences-feature';
import { useAnimelist } from '../../hooks';


interface AnimeCardProps {
    anime: AnimeType,
    className?: string
}

export const AnimeCard: React.FC<AnimeCardProps> = ({anime, className}) => {
    // const useFavorite = useFavorites();
    const useFollowedAnime = useFollowedAnimes();
    const useAnimes = useAnimelist();

    // useEffect(() => {

    // }, [useFavorite.remove, useFollowedAnime.remove])

    // const handleAddToFavorites = async (anime: AnimeType) => {
    //     if (isFavorite(anime)) {
    //         useFavorite.remove(anime.uid)
    //     } else {
    //         useFavorite.addOrUpdate({uid: anime.uid, animeId: anime.uid, title: anime.title, subtitle: anime.subtitle, originalTitle: anime.originalTitle, order: 1});
    //     }
    // }

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
                updatedAt: anime.updatedAt
            })
        }
    }

    const isFollowed = (anime: AnimeType): boolean => {
        const results = useFollowedAnime.items?.filter(f => f.title === anime.title)
        return results?.length === 1
    }

    // const isFavorite = (anime: AnimeType): boolean => {
    //     const results = useFavorite.items?.filter(f => f.title === anime.title)
    //     return results?.length === 1
    // }

    const keywords = (anime: AnimeType) => encodeURIComponent(`${anime.title} ${anime.lastEpisode ? anime.lastEpisode : ''}`)

    const handleIncraseEpisode = (anime: AnimeType): void => {
        useAnimes.upsert({...anime, lastEpisode: anime.lastEpisode ? Number(anime.lastEpisode) + 1 : 1});
    }

    return (
        <div className={`${className} p-2 md:hover:border border-gold rounded-md`}>
            <div className='relative -z-1'>
                <div className='grid grid-rows-4 pt-5 absolute translate-y-14'>
                    <Link href={`/videosearch?keywords=${keywords(anime)}`} className="searchlink gap-2 p-4">
                        <FaMagnifyingGlass size={36} className="p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant"/>
                    </Link>
                    <Link href={''} className='followinglink gap-2 p-4' onClick={() => handleFollowAnime(anime)}>
                        <FaThumbtack size={36} className={`${isFollowed(anime) ? 'text-tertiary hover:text-primary' : ''} p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant`}/>
                    </Link>
                    {/* <Link href={''} className='favoritelink gap-2 p-4' onClick={() => handleAddToFavorites(anime)}>
                        <FaHeartCirclePlus size={36} className={`${isFavorite(anime) ? 'text-tertiary hover:text-primary' : ''} p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant`}/>
                    </Link> */}
                    <Link href={`/animelist/${anime.uid}?mode=edit`} className="editlink gap-2 p-4">
                        <FaPenToSquare size={36} className="p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant"/>
                    </Link>
                    <Link href={``} className="pluslink gap-2 p-4" onClick={() => handleIncraseEpisode(anime)}>
                        <FaFileCirclePlus size={36} className="p-2 bg-secondaryVariant rounded-md border border-tertiaryVariant outline outline-tertiaryVariant"/>
                    </Link>
                </div>
                <div className='title p-2 m-1 absolute translate-x-3 translate-y-4 font-bold text-xl text-wrap text-tertiary border rounded-sm bg-secondaryVariant place-self-end place-items-end place-content-end self-end items-end content-end justify-self-end justify-items-end justify-end'>{anime.originalTitle}</div>

                <Link className='thumbnaillink' href={`/animelist/${anime.uid}`}>
                    <Image className='anime max-h-screen h-128' src={anime.thumbnail || ''} alt={anime.title} width={480} height={480} />
                </Link>
            </div>
            <div className=''>
                <Link className='titlelink'
                    href={`/animelist/${anime.uid}`}>
                    <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{anime.title}</div>
                    <div className='title py-2 h-8 text-sm text-wrap text-tertiary decoration-primaryVariant'>{anime.subtitle}</div>
                </Link>
                <div className='description text-sm text-wrap pt-4 h-10 '>{`${anime.summary.substring(0, 140)} ...`}</div>
                <div className='content pt-12'>
                    <div className='grid grid-cols-2 gap-2 items-center'>
                        <div className='ml-2'>update every </div>
                        <div className='ml-2'>{anime.updateDays}</div>
                        <div className='ml-2'>episodes of season:</div>
                        <div className='ml-2'>{anime.lastSeasonEpisode} {`${anime.status === 'completed' ? '/ ' + anime.totalSeasonEpisodes : ''}`}</div>
                        <div className='ml-2'>last episode:</div>
                        <div className='ml-2'>{anime.lastEpisode} {`${anime.status === 'completed' ? '/ ' + anime.totalEpisodes : ''}`}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

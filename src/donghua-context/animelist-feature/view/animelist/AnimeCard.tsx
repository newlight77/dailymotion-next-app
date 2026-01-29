import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaPenToSquare, FaMagnifyingGlass, FaFileCirclePlus, FaThumbtack, FaStar } from 'react-icons/fa6';
import { AnimeType } from '../../domain/model';
import { useWatchLists } from '@/donghua-context/user-preferences-feature';
import { useAnimelist } from '../../hooks';
import StarRating from '@/components/atoms/StarRating';


interface AnimeCardProps {
    anime: AnimeType,
    className?: string,
    watchListId?: string,
    isInWatchListOverride?: boolean,
    canModify?: boolean
}

export const AnimeCard: React.FC<AnimeCardProps> = ({anime, className, watchListId, isInWatchListOverride, canModify = true}) => {
    const watchLists = useWatchLists();
    const useAnimes = useAnimelist();
    const [showWatchLists, setShowWatchLists] = useState(false);
    const [isInWatchList, setIsInWatchList] = useState(false);
    const [showRatingPicker, setShowRatingPicker] = useState(false);
    const [ratingStats, setRatingStats] = useState<{ average: number; count: number; userRating: number | null }>({
        average: 0,
        count: 0,
        userRating: null,
    });

    const keywords = (anime: AnimeType) => encodeURIComponent(`${anime.title} ${anime.lastEpisode ? anime.lastEpisode : ''}`)

    const handleIncraseEpisode = (anime: AnimeType): void => {
        useAnimes.upsert({...anime, lastEpisode: anime.lastEpisode ? Number(anime.lastEpisode) + 1 : 1});
    }

    useEffect(() => {
        if (!watchListId) return;
        const next = (watchLists.items || []).some(item => item.animeId === anime.uid);
        setIsInWatchList(next);
    }, [watchListId, watchLists.items, anime.uid]);

    // initialize rating stats from server-attached rating when available
    useEffect(() => {
        const rated = anime as AnimeType & { rating?: { average: number; count: number } };
        if (rated.rating) {
            setRatingStats(prev => ({
                average: Number(rated.rating!.average ?? 0),
                count: Number(rated.rating!.count ?? 0),
                userRating: prev.userRating ?? null,
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anime.uid]);

    const activeInWatchList = isInWatchListOverride ?? isInWatchList;

    const handleToggleWatchLists = async () => {
        if (watchListId) {
            if (activeInWatchList) {
                await watchLists.removeAnime(watchListId, anime.uid);
                setIsInWatchList(false);
            } else {
                await watchLists.addAnime(watchListId, anime);
                setIsInWatchList(true);
            }
            return;
        }

        try {
            await watchLists.loadLists();
            setShowWatchLists(prev => !prev);
        } catch (err: unknown) {
            console.error('Failed to create/load watch list collection', err);
            const message = err instanceof Error ? err.message : String(err);
            if (message.toLowerCase().includes('unauthorized')) {
                // redirect to sign in
                window.location.href = '/signin';
                return;
            }
            // fallback: show sign in for any auth-like errors
            alert('Unable to access watch lists. Please sign in and try again.');
        }
    }

    const handleAddToWatchList = async (listId: string) => {
        await watchLists.addAnime(listId, anime);
        setShowWatchLists(false);
    }

    const handleSetRating = async (value: number) => {
        try {
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animeId: anime.uid, value }),
            });
            if (response.status === 401) {
                window.location.href = '/signin';
                return;
            }
            if (!response.ok) {
                throw new Error(`Failed to rate anime (${response.status})`);
            }
            setShowRatingPicker(false);
            try {
                const resp = await fetch(`/api/ratings?animeId=${anime.uid}`);
                if (resp.ok) {
                    const data = await resp.json();
                    setRatingStats({
                        average: Number(data?.average || 0),
                        count: Number(data?.count || 0),
                        userRating: data?.userRating?.value ?? null,
                    });
                }
            } catch (err) {
                console.error('Failed to refresh rating after save', err);
            }
        } catch (error) {
            console.error('Failed to save rating', error);
        }
    };

    return (
        <div className={`${className} p-2 md:hover:border border-gold rounded-md`}>
            <div className='grid relative'>
                <div className='grid grid-rows-5 pt-5 absolute translate-y-14'>
                    <Link href={`/videosearch?keywords=${keywords(anime)}`} className="searchlink gap-2 p-4">
                        <FaMagnifyingGlass size={36} className="p-2 bg-secondary/80 rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
                    </Link>
                    <div about="rate anime" aria-label="rating" className='ratinglink gap-2 p-4' onClick={() => setShowRatingPicker(prev => !prev)}>
                        <FaStar size={36} className="p-2 bg-secondary/80 rounded-md border border-tertiary-variant outline outline-tertiary-variant hover:border-gold hover:outline-gold hover:cursor-pointer"/>
                    </div>
                    <div about="watch list" aria-label="watch list" className='watchlistlink gap-2 p-4' onClick={() => { if (watchListId && !canModify) { alert('Only the list owner can modify this list'); return; } handleToggleWatchLists(); }}>
                        <FaThumbtack aria-label="watch list" size={36} className={`${watchListId && activeInWatchList ? 'text-primary bg-secondary/80 hover:text-tertiary' : ''} p-2 bg-secondary/80 rounded-md border border-tertiary-variant outline outline-tertiary-variant hover:border-gold hover:outline-gold hover:cursor-pointer`}/>
                    </div>
                    <Link href={`/animelist/${anime.uid}?mode=edit`} className="editlink gap-2 p-4">
                        <FaPenToSquare size={36} className="p-2 bg-secondary/80 rounded-md border border-tertiary-variant outline outline-tertiary-variant"/>
                    </Link>
                    <div about="increase episode" aria-label="increase episode" className="pluslink gap-2 p-4" onClick={() => handleIncraseEpisode(anime)}>
                        <FaFileCirclePlus aria-label="increase episode" size={36} className="p-2 bg-secondary/80 rounded-md border border-tertiary-variant outline outline-tertiary-variant hover:border-gold hover:outline-gold hover:cursor-pointer"/>
                    </div>
                </div>
                {showRatingPicker && (
                    <div className='absolute left-16 top-16 z-20 bg-secondary-variant/70 backdrop-blur-md border border-tertiary-variant rounded-md p-2 text-xs min-w-40'>
                        <div className='text-xs text-tertiary pb-2'>rate this anime</div>
                        <StarRating value={ratingStats.userRating || 0} readOnly={false} size={18} onChange={handleSetRating} />
                    </div>
                )}
                {showWatchLists && (
                    <div className='absolute left-16 top-28 z-20 bg-secondary-variant/70 backdrop-blur-md border border-tertiary-variant rounded-md p-2 text-xs min-w-40'>
                        {(watchLists.lists && watchLists.lists.length > 0) ? (
                            watchLists.lists.map(list => (
                                <button
                                    key={list.uid}
                                    className='block w-full text-left px-2 py-1 hover:text-tertiary'
                                    onClick={() => handleAddToWatchList(list.uid)}
                                >
                                    {list.title}
                                </button>
                            ))
                        ) : (
                            <div className='px-2 py-1 text-gray-400'>no watch lists yet</div>
                        )}
                        <Link
                            href={'/watchlists'}
                            className='block px-2 py-1 hover:text-tertiary'
                            onClick={() => setShowWatchLists(false)}
                        >
                            manage watch lists
                        </Link>
                    </div>
                )}
                <div className='absolute right-1 top-1 z-10 flex items-center gap-1 rounded-md bg-secondary/60 backdrop-blur-sm px-2 py-1'>
                    <StarRating value={ratingStats.average} readOnly size={18} />
                    <span className='text-[18px] text-tertiary'>{ratingStats.average.toFixed(1)}</span>
                </div>
                <div className='title p-2 m-1 absolute translate-y-11 font-bold text-xxl text-wrap text-tertiary border rounded-sm bg-secondary/50 justify-self-end'>{anime.originalTitle}</div>
                {/* <div className='title p-2 m-1 absolute translate-x-3 translate-y-4 font-bold text-xl text-wrap text-tertiary border rounded-sm bg-secondaryVariant place-self-end place-items-end place-content-end self-end items-end content-end justify-self-end justify-items-end justify-end'>{anime.originalTitle}</div> */}

            </div>
            <Link className='thumbnaillink' href={`/animelist/${anime.uid}`}>
                <Image className='anime max-h-screen h-128' src={anime.thumbnail || ''} alt={anime.title} width={480} height={480} />
            </Link>
            <div className=''>
                <Link className='titlelink'
                    href={`/animelist/${anime.uid}`}>
                    <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{anime.title}</div>
                    <div className='title py-2 h-8 text-sm text-wrap text-tertiary decoration-primary-variant'>{anime.subtitle}</div>
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
                        <div className='ml-2'>published:</div>
                        <div className='ml-2 text-xs'>{anime.publishedAt ? new Date(anime.publishedAt).toLocaleDateString() : 'N/A'}</div>
                        <div className='ml-2'>released:</div>
                        <div className='ml-2 text-xs'>{anime.releaseAt ? new Date(anime.releaseAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

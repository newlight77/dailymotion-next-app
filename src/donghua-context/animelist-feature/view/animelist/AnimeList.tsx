'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link'
import Modal from '@/components/molecules/Modal';
import { useAnimelist } from '../../hooks';
import { AnimeType } from '../../domain';
import { AnimeCard } from './AnimeCard';
import { AnimeEdit } from './AnimeEdit';
import { useLocalStorage } from '@/core/core-lib/shared/useLocalStorage';
import { useWatchLists } from '@/donghua-context/user-preferences-feature';

type AnimeWithOrderScore = AnimeType & {
    orderScore: number
}

type Props = {
    className?: string,
}

export const AnimeList: React.FC<Props> = ({className}) => {
    const useAnimes = useAnimelist();
    useWatchLists();
    const [data, setData] = useState('')
    const [addModal, setAddModal] = useState(false);
    const [loadMode, setLoadMode] = useState(false);
    const [filterKeywords, setFilterKeywords] = useLocalStorage<string>('filterKeywords', '');
    const [excludeCompleted, setExcludeCompleted] = useState(false);
    const [onlyWithUpdates, setOnlyWithUpdates] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // useEffect(() => {
    // }, [onlyCompleted]);

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    function toggleLoadMode(): void {
        setLoadMode(loadMode ? false : true);
    }

    function toggleAddModal(): void {
        setAddModal(addModal ? false : true);
    }

    const handleReloadDataChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (event.target.value !== data) {
            setData(event.target.value);
        }
    };

    const handleExcludeCompletedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExcludeCompleted(event.target.checked)
    };

    const handleOnlyWithUpdatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOnlyWithUpdates(event.target.checked)
        if (event.target.checked) setExcludeCompleted(true)
    };

    const reloadData = () => {
        if (data) {
            try {
                const newAnimelist = (JSON.parse(data) as AnimeType[])
                .reduce<AnimeType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
                useAnimes.load(newAnimelist);
            } catch (error) {
                // display error latet
                alert(`there is an error with the json you try to load : ${error}`);
            }
        }
    };

    const sample = JSON.stringify(
        [], null, 4
    )

    // function orderScore(anime: AnimeType): number {
    //     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //     const todayWeekDay = new Date().getDay();

    //     if (anime.updateDays) {
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 0) % 7].toLowerCase())) return 7;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 1) % 7].toLowerCase())) return 6;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 2) % 7].toLowerCase())) return 5;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 3) % 7].toLowerCase())) return 4;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 4) % 7].toLowerCase())) return 3;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 5) % 7].toLowerCase())) return 2;
    //         if (anime.updateDays.toLowerCase().includes(daysOfWeek[(todayWeekDay + 6) % 7].toLowerCase())) return 1;
    //     }
    //     return 0;
    // }

    // include optional ratingAvg (0..5) in score calculation
    function orderScore(anime: AnimeType, ratingAvg = 0): number {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayWeekDay = new Date().getDay();

        // Score based on update days (0-7)
        let updateDaysScore = 0;
        if (anime.updateDays) {
          for (let i = 0; i < 7; i++) {
            const day = daysOfWeek[(todayWeekDay + i) % 7].toLowerCase();
            if (anime.updateDays.toLowerCase().includes(day)) {
              updateDaysScore = 7 - i;
              break;
            }
          }
        }

        // Score based on updatedAt (latest has higher score)
        let updatedAtScore = 0;
        if (anime.updatedAt) {
          const updatedDate = new Date(anime.updatedAt);
          const now = new Date();
          const daysSinceUpdated = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysSinceUpdated <= 30) {
            updatedAtScore = 10;
          } else if (daysSinceUpdated <= 90) {
            updatedAtScore = 7;
          } else if (daysSinceUpdated <= 180) {
            updatedAtScore = 5;
          } else if (daysSinceUpdated <= 365) {
            updatedAtScore = 3;
          } else if (daysSinceUpdated <= 730) {
            updatedAtScore = 1;
          }
        }

        // Score based on publishedAt (latest has higher score)
        let publishedAtScore = 0;
        if (anime.publishedAt) {
          const publishedDate = new Date(anime.publishedAt);
          const now = new Date();
          const daysSincePublished = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysSincePublished <= 30) {
            publishedAtScore = 10;
          } else if (daysSincePublished <= 90) {
            publishedAtScore = 7;
          } else if (daysSincePublished <= 180) {
            publishedAtScore = 5;
          } else if (daysSincePublished <= 365) {
            publishedAtScore = 3;
          } else if (daysSincePublished <= 730) {
            publishedAtScore = 1;
          }
        }

        // Score based on global rating (ratingAvg is between 0 and 5)
        // weight ratings so that a 5-star rating contributes meaningfully but does not dominate
        const ratingWeight = 4; // max contribution 20 (5 * 4)
        const ratingScore = ratingAvg ? ratingAvg * ratingWeight : 0;

        // Combine scores: updateDaysScore is multiplied by 3, then add both date scores and rating score
        return (updateDaysScore * 3) + updatedAtScore + publishedAtScore + ratingScore;
    }

    const [ratingsMap, setRatingsMap] = useState<Record<string, { average: number; count: number }>>({});

    const fetchRatingsFor = useCallback(async (animeIds: string[]) => {
        if (!animeIds || animeIds.length === 0) return;
        try {
            const results = await Promise.all(animeIds.map(async (id) => {
                try {
                    const response = await fetch(`/api/ratings?animeId=${id}`);
                    if (!response.ok) return { id, average: 0, count: 0 };
                    const data = await response.json();
                    return { id, average: Number(data?.average || 0), count: Number(data?.count || 0) };
                } catch (err) {
                    return { id, average: 0, count: 0 };
                }
            }));

            const next: Record<string, { average: number; count: number }> = {};
            for (const r of results) {
                next[r.id] = { average: r.average, count: r.count };
            }
            setRatingsMap(next);
        } catch (error) {
            console.error('Failed to fetch ratings map', error);
        }
    }, []);

    function withOrderScore(anime: AnimeType): AnimeWithOrderScore {
        const rating = ratingsMap[anime.uid]?.average ?? 0;
        const score = orderScore(anime, rating);
        return {
            ...anime,
            orderScore: score
        }
    }

    function filterList(items: AnimeType[] | undefined): AnimeType[] {
        if (!items) return []
        return items
            .filter(
                v => filterKeywords && filterKeywords !== '' ?
                    v.title.toLowerCase().includes(filterKeywords.toLowerCase())
                    || v.originalTitle!.toLocaleLowerCase().includes(filterKeywords.toLowerCase())
                    || v.subtitle!.toLocaleLowerCase().includes(filterKeywords.toLowerCase())
                    || v.summary.toLowerCase().includes(filterKeywords.toLowerCase())
                    || v.updateDays.toLowerCase().includes(filterKeywords.toLowerCase())
                : true)
            .filter(v => onlyWithUpdates ? v.updateDays !== '' : true)
            .filter(v => excludeCompleted ? v.status !== 'completed' : true )
    }

    const filteredItems = useMemo(() => filterList(useAnimes.items), [useAnimes.items, filterKeywords, excludeCompleted, onlyWithUpdates]);

    useEffect(() => {
        // fetch ratings for all currently visible items to include in ordering
        const ids = filteredItems.map(i => i.uid);
        fetchRatingsFor(ids);
    }, [filteredItems, fetchRatingsFor]);

    if (!isMounted) {
        return <div className={className}><div id="modal-root"></div></div>
    }

    return (
        <div className={className}>

            <div id="modal-root"></div>

            {addModal &&
                <Modal className='sm:w-128 sm:h-156 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-2/5 3xl:w-3/8 z-40' onClose={() => setAddModal(false)} title={'New Amine'}>
                    <AnimeEdit mode={'add'}></AnimeEdit>
                </Modal>
            }

            {
                useAnimes.items && useAnimes.items?.length > 0 ?
                <div className="pt-4 pb-4 text-primary">
                    <input
                        className='w-96'
                        type="text"
                        value={filterKeywords}
                        onChange={onFilterInputChange}
                        placeholder="filter on title, subtile original title or summary"
                    />
                    <label className='px-2 w-12'>exclude completed</label>
                    <input className='px-2 w-4'
                        type="checkbox"
                        checked={excludeCompleted}
                        onChange={handleExcludeCompletedChange} />
                    <label className='px-2 w-12'>only with updates</label>
                    <input className='px-2 w-4'
                        type="checkbox"
                        checked={onlyWithUpdates}
                        onChange={handleOnlyWithUpdatesChange} />

                </div>
                :
                <></>
            }

            <label className='px-4 w-12'>total: {filterList(useAnimes.items).length} / {useAnimes.items?.length}</label>

            <div className='animelist-header p-4'>
                { addModal ?
                    <span className="pr-4">add</span>
                    :
                    <Link href={''} className="pr-4" onClick={toggleAddModal}>add</Link>
                }
                <Link href={''} className="pr-4" onClick={toggleLoadMode}>load</Link>
                <Link href={''} className="pr-4" onClick={useAnimes.reset}>reset</Link>

                {loadMode ?
                    <>
                        <textarea
                            className='w-full h-96 rounded-lg'
                            defaultValue={data || ''}
                            onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => handleReloadDataChange(event) }
                            placeholder={`Example : \n ${sample}`}
                        ></textarea>
                        <Link href={''} className="pl-4" onClick={reloadData}>load</Link>
                    </>
                    :
                    <></>
                }
            </div>

            <div className="md:flex flex-wrap">
                {
                    filteredItems
                    .map((anime: AnimeType) => withOrderScore(anime))
                    .sort((a: AnimeWithOrderScore, b: AnimeWithOrderScore) => b.orderScore - a.orderScore)
                    .map((anime: AnimeWithOrderScore) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { orderScore, ...animeWithoutOrderScore }: AnimeWithOrderScore = anime;
                        return animeWithoutOrderScore;
                    })
                    .map(anime => (
                        <AnimeCard
                            className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 3xl:w-1/6 4xl:w-1/7 5xl:w-1/8 min-w-80 h-auto"
                            key={anime.uid}
                            anime={anime} >
                        </AnimeCard>
                    ))
                }
            </div>
        </div>
    );
};

export default AnimeList;

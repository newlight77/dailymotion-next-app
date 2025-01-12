import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'
import serie from './series';

const FAVORITES: FavoriteWithEpisodes[] = [
    ...serie,
]
.reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], [])
// .sort((a: FavoriteType, b: FavoriteType) => a.title.localeCompare(b.title));

interface FavoritesProps {
    newFavorite?: FavoriteType,
    onSelected: (favorite: FavoriteWithEpisodes) => void;
}

export type FavoriteType = {
    uid: string,
    title: string,
}

export type FavoriteWithEpisodes = FavoriteType & {
    subtitle?: string,
    lastEpisode?: string,
    total?: number
}

const Favorites: React.FC<FavoritesProps> = ({ newFavorite, onSelected }) => {
    const [favorites, setFavorites] = useLocalStorage<FavoriteWithEpisodes[]>(`favorites`, FAVORITES);
    const [editMode, setEditMode] = useState(false);
    const [show, setShow] = React.useState(false)
    const [data, setData] = React.useState('')

    const addOrUpdate = (favorite?: FavoriteWithEpisodes) : FavoriteWithEpisodes | undefined => {
        if (favorite && favorites) {
            const newFavorite: FavoriteWithEpisodes = {
                uid: favorite.uid ? favorite.uid : crypto.randomUUID().toString(),
                title: favorite.title,
                lastEpisode: favorite.lastEpisode,
                total: favorite.total
            }
            const newFavorites = [newFavorite, ...favorites]
                .reduce<FavoriteWithEpisodes[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
            setFavorites(newFavorites);
            return newFavorite
        }
    }

    useEffect(() => {
        addOrUpdate(newFavorite);
    }, [newFavorite]);

    const selectFavorite = async (selected: FavoriteWithEpisodes) => {
        onSelected(selected)
    }

    const deleteFavorite = async (uid: string) => {
        if (favorites) {
            const newFavorites = favorites.filter(s => s.uid !== uid)
            setFavorites(newFavorites);
        }
    }

    const handleLastEpisodeBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteWithEpisodes) => {
        if (event.target.value !== selected.lastEpisode ) {
            console.log('last episode change', event.target.value);
            const updated = addOrUpdate({ ...selected, lastEpisode: event.target.value });
            console.log('last episode updated', updated);
        }
    };

    const handleSubtitleBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteWithEpisodes) => {
        if (event.target.value !== selected.subtitle ) {
            console.log('last episode change', event.target.value);
            const updated = addOrUpdate({ ...selected, subtitle: event.target.value });
            console.log('subtitle updated', updated);
        }
    };

    const handleReloadDataChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (event.target.value !== data) {
            setData(event.target.value);
        }
    };

    const loadData = () => {
        if (data) {
            try {
                const newFavorites = (JSON.parse(data) as FavoriteWithEpisodes[])
                .reduce<FavoriteWithEpisodes[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
                setFavorites(newFavorites);
            } catch (error) {
                // display error latet
                alert(`there is an error with the json you try to load : ${error}`);
            }
        }
    };

    function resetFavorites(): void {
        setFavorites(FAVORITES);
    }

    function toggleEditFavorites(): void {
        setEditMode(editMode ? false : true);
    }

    function toggleShowHide(): void {
        setShow(show ? false : true);
    }

    const sample = JSON.stringify(
    [
        {
            "uid": "910906a2-95eb-4c8b-b560-91fe65754252",
            "title": "divine lord of the heavens",
            "lastEpisode": "28",
            "total": 0
        },
        {
            "uid": "7526bc07-7eb1-41df-afd2-67b1bbeb94b0",
            "title": "martial peak",
            "lastEpisode": "19",
            "total": 0
        }
    ], null, 4
    )

    return (
        <div className='p-1 md:p-2 md:w-1/5'>
            <div>
                <div className="flex flex-row md:gap-4 md:p-4 items-center">
                    <Link href={''} onClick={toggleShowHide}>
                    { show ?
                        <h3>My favorite titles</h3>
                        :
                        'show favorites'
                    }
                    </Link>
                </div>
            </div>
            <div>
                {
                    show ?
                    <div className='items-center min-w-72'>
                        <button onClick={toggleEditFavorites}>edit episode</button>
                        <button onClick={resetFavorites}>reset</button>
                        {editMode ?
                            <>
                                <textarea
                                    className='flex w-full h-96'
                                    defaultValue={data || ''}
                                    onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => handleReloadDataChange(event) }
                                    placeholder={`Example : \n ${sample}`}
                                ></textarea>
                                <button onClick={loadData}>load</button>
                            </>
                            :
                            <></>
                        }
                        <div>
                            { favorites?.map(kw => (
                                <div key={crypto.randomUUID().toString()} className="flex flex-wrap gap-4 items-center">
                                    <Link href={''} className="basis-1/8" onClick={() => deleteFavorite(kw.uid)}>
                                        delete
                                    </Link>
                                    <Link href={''} className="basis-5/8" onClick={() => selectFavorite(kw)}>
                                        <div>{`${kw.title} ${kw.total ? '(' + kw.total + ')': ''}` }</div>
                                        { kw.subtitle ? <div>{kw.subtitle}</div> : <></>}
                                    </Link>

                                    { editMode ?
                                        <div>
                                            <input
                                                className='basis-1/8 min-w-8 max-w-28 h-6'
                                                type="text"
                                                defaultValue={kw.subtitle || ''}
                                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleSubtitleBlur(event, kw) }
                                                placeholder=""
                                            />
                                            <input
                                                className='basis-1/8 min-w-8 max-w-28 h-6 w-12'
                                                type="text"
                                                defaultValue={kw.lastEpisode || ''}
                                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleLastEpisodeBlur(event, kw) }
                                                placeholder="subtitle"
                                            />
                                        </div>
                                    :
                                        <div>
                                            <Link href={''} className="basis-1/8" onClick={() => selectFavorite(kw)}>
                                                {`${ kw.lastEpisode ? kw.lastEpisode : ''}` }
                                            </Link>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    <></>
            }
            </div>
        </div>
    );
};

export default Favorites;
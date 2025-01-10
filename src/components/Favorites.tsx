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
    lastEpisode?: string,
    total?: number
}

const Favorites: React.FC<FavoritesProps> = ({ newFavorite, onSelected }) => {
    const [favorites, setFavorites] = useLocalStorage<FavoriteWithEpisodes[]>(`favorites`, FAVORITES);
    const [editMode, setEditMode] = useState(false);
    const [show, setShow] = React.useState(false)

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

    function resetFavorites(): void {
        setFavorites(FAVORITES);
    }

    function toggleEditFavorites(): void {
        setEditMode(editMode ? false : true);
    }

    function toggleShowHide(): void {
        setShow(show ? false : true);
    }

    return (
        <div className='absolute z-100 right-0 p-2 m-1 h-200 w-1/5 bg-darkSdeepskyblueVariant'>
            <div>
                <div className="flex flex-row gap-4 p-4 items-center">
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
                        <div>
                            { favorites?.map(kw => (
                                <div key={crypto.randomUUID().toString()} className="flex flex-wrap gap-4 items-center">
                                    <Link href={''} className="basis-1/8" onClick={() => deleteFavorite(kw.uid)}>
                                        delete
                                    </Link>
                                    <Link href={''} className="basis-5/8" onClick={() => selectFavorite(kw)}>
                                        {`${kw.title} ${kw.total ? '(' + kw.total + ')': ''}` }
                                    </Link>

                                    { editMode ?
                                        <div>
                                            <input
                                                className='basis-1/8 min-w-8 max-w-28 h-6 w-12'
                                                type="text"
                                                defaultValue={kw.lastEpisode || ''}
                                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleLastEpisodeBlur(event, kw) }
                                                placeholder=""
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
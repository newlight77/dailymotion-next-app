import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'
import serie from './data/series';

const LOWEST_ORDER = Number.MAX_VALUE;

const FAVORITES: FavoriteType[] = [
    ...serie,
]
// dedup
.reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], [])
// .sort((a: FavoriteType, b: FavoriteType) => a.title.localeCompare(b.title));
.sort((a: FavoriteType, b: FavoriteType) => (a.order ?? LOWEST_ORDER) - (b.order ?? LOWEST_ORDER));

interface FavoritesProps {
    newFavorite?: FavoriteType,
    onSelected: (favorite: FavoriteType) => void;
}

export type FavoriteType = {
    uid: string,
    title: string,
    order: number,
    originalTitle?: string,
    subtitle?: string,
    lastEpisode?: string,
    total?: number
}

const Favorites: React.FC<FavoritesProps> = ({ newFavorite, onSelected }) => {
    const [favorites, setFavorites] = useLocalStorage<FavoriteType[]>(`favorites`, FAVORITES);
    const [editMode, setEditMode] = useState(false);
    const [show, setShow] = React.useState(false)
    const [data, setData] = React.useState('')

    const addOrUpdate = (favorite?: FavoriteType) => {
        if (favorite && favorites) {
            const newFavorite: FavoriteType = { ...favorite, uid: favorite.uid ? favorite.uid : crypto.randomUUID().toString() }
            const newFavorites = [newFavorite, ...favorites]
                // dedup
                .reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], [])
                .sort((a, b) => (a.order) - (b.order));
            setFavorites(newFavorites);
        }
    }

    const shiftItems = (originalOrder: number, changed: FavoriteType, current: FavoriteType) => {
        if (changed.order < originalOrder) {
            if (changed.order <= current.order && current.order <= originalOrder) {
                current.order += 1;
            }
        }
        if (changed.order > originalOrder) {
            if (changed.order >= current.order && current.order >= originalOrder) {
                current.order -= 1;
            }
        }
    }

    const insertAtAndShiftAllItemsOrder = (originalOrder: number, changed?: FavoriteType) => {
        if (changed && favorites) {
            const sortedItems = favorites.sort((a, b) => (a.order) - (b.order));

             // Adjust the order of all items that have an order greater than the new order
            sortedItems.forEach(f => {
                shiftItems(originalOrder, changed, f);
            });

            // Update the changed item with its new order (keep the existing title)
            // const updatedFavorite: FavoriteType = { ...changedFavorite, order: changedFavorite.order  }
            // const updatedFavorites = [updatedFavorite, ...sortedFavorites]
            // .reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], [])
            // .sort((a, b) => (a.order) - (b.order));

            const updatedItems = sortedItems
            .map(f => {
                if (f.uid === changed.uid) {
                  return { ...f, order: changed.order };
                }
                return f;
            })
            .sort((a, b) => a.order - b.order);
            setFavorites(updatedItems);
        }
    }

    useEffect(() => {
        addOrUpdate(newFavorite);
    }, [newFavorite]);

    const selectFavorite = async (selected: FavoriteType) => {
        onSelected(selected)
    }

    const deleteFavorite = async (uid: string) => {
        if (favorites) {
            const newFavorites = favorites.filter(s => s.uid !== uid)
            setFavorites(newFavorites);
        }
    }

    const handleLastEpisodeBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.lastEpisode ) {
            addOrUpdate({ ...selected, lastEpisode: event.target.value });
        }
    };

    const handleOrderBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.order?.toString() ) {
            insertAtAndShiftAllItemsOrder(selected.order, { ...selected, order: Number(event.target.value) });
        }
    };

    const handleOriginalTitleBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.originalTitle ) {
            addOrUpdate({ ...selected, originalTitle: event.target.value });
        }
    };

    const handleSubtitleBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.subtitle ) {
            addOrUpdate({ ...selected, subtitle: event.target.value });
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
                const newFavorites = (JSON.parse(data) as FavoriteType[])
                .reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
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
        <div className='p-1 md:p-2 w-1/8'>
            <div>
                <div className="flex flex-row md:gap-1 md:pt-4 items-center">
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
                    <div className='items-center min-w-80 bg-secondary'>
                        <div className="pb-4">
                        <Link href={''} className="pr-4" onClick={toggleEditFavorites}>edit</Link>
                        <Link href={''} className="pr-4" onClick={resetFavorites}>reset</Link>
                        </div>
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
                                <div key={crypto.randomUUID().toString()} className="flex flex-wrap gap-4 mt-2 items-center hover:border rounded-md border-gold bg-secondaryVariant">
                                    <Link href={''} className="basis-1/8" onClick={() => deleteFavorite(kw.uid)}>
                                        delete
                                    </Link>
                                    <Link href={''} className={`basis-5/8 ${kw.order < 100 ? "text-gold" : ""}`} onClick={() => selectFavorite(kw)}>
                                        <div>{`${kw.title} ${kw.total ? '(' + kw.total + ')': ''}` }</div>
                                        { kw.originalTitle ? <div className='pl-2 pr-2 w-fit border border-primaryVariant'>{kw.originalTitle}</div> : <></>}
                                        { kw.subtitle ? <div>{kw.subtitle}</div> : <></>}
                                    </Link>

                                    { editMode ?
                                        <div>
                                            <input
                                                className='basis-1/8 min-w-8 max-w-36 h-6'
                                                type="text"
                                                defaultValue={kw.order || ''}
                                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleOrderBlur(event, kw) }
                                                placeholder="order"
                                            />
                                            <input
                                                className='basis-1/8 min-w-8 max-w-28 h-6 border'
                                                type="text"
                                                defaultValue={kw.originalTitle || ''}
                                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleOriginalTitleBlur(event, kw) }
                                                placeholder="original title"
                                            />
                                            <input
                                                className='basis-1/8 min-w-8 max-w-28 h-6'
                                                type="text"
                                                defaultValue={kw.subtitle || ''}
                                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleSubtitleBlur(event, kw) }
                                                placeholder="subtitle"
                                            />
                                            <input
                                                className='basis-1/8 min-w-8 max-w-28 h-6 w-12'
                                                type="text"
                                                defaultValue={kw.lastEpisode || ''}
                                                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleLastEpisodeBlur(event, kw) }
                                                placeholder="episode"
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
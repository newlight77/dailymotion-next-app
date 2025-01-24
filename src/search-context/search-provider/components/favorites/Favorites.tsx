import React, { useState } from 'react';
import Link from 'next/link'
import { useFavorites } from './FavoritesProvider';


interface FavoritesProps {
    onSelected: (favorite: FavoriteType) => void;
    className?: string,
}

export type FavoriteType = {
    uid: string,
    title: string,
    order: number,
    originalTitle?: string,
    subtitle?: string,
    owner?: string,
    lastEpisode?: string,
    total?: number
}

const Favorites: React.FC<FavoritesProps> = ({ onSelected, className }) => {
    const { items, remove, addOrUpdate, loadData, reset } = useFavorites();
    const [editMode, setEditMode] = useState(false);
    const [data, setData] = React.useState('')

    const handleSelectFavorite = async (selected: FavoriteType) => {
        onSelected(selected)
        // no navigate to /search/keywords or other pages, because here we should not know about how pages are structured
    }

    // const router = useRouter()
    // const handleSelectFavorite = (favorite: FavoriteType) => {
    //     const title = encodeURIComponent(`${favorite.title} ${favorite.originalTitle ? favorite.lastEpisode : ''}`)
    //     console.log(`selected favorite, should navigate to /?keywords=${title}`);
    //     router.push(`/?keywords=${title}`);
    //     console.log(`selected favorite, should navigate to /?keywords=${title}`);
    // };

    const handleDeleteFavorite = async (uid: string) => {
        if (items) {
            remove(uid);
        }
    }

    const handleLastEpisodeBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.lastEpisode ) {
            addOrUpdate({ ...selected, lastEpisode: event.target.value });
        }
    };

    const handleOrderBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.order?.toString() ) {
            addOrUpdate({ ...selected, order: Number(event.target.value) });
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

    const reloadData = () => {
        if (data) {
            try {
                const newFavorites = (JSON.parse(data) as FavoriteType[])
                .reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
                loadData(newFavorites);
            } catch (error) {
                // display error latet
                alert(`there is an error with the json you try to load : ${error}`);
            }
        }
    };

    function toggleEditMode(): void {
        setEditMode(editMode ? false : true);
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
        <div className={className}>
            <div className='favorties-header pb-4'>
                <Link href={''} className="pr-4" onClick={toggleEditMode}>edit</Link>
                <Link href={''} className="pr-4" onClick={reset}>reset</Link>

                {editMode ?
                    <>
                        <textarea
                            className='flex w-full h-96 rounded-lg'
                            defaultValue={data || ''}
                            onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => handleReloadDataChange(event) }
                            placeholder={`Example : \n ${sample}`}
                        ></textarea>
                        <button onClick={reloadData}>load</button>
                    </>
                    :
                    <></>
                }
            </div>
            <div className='favorites-list flex flex-col gap-2'>
                { items?.map(kw => (
                    <div key={crypto.randomUUID().toString()} className="basis-1/2 grid grid-cols-8 gap-4 items-center hover:border rounded-md border-tertiary bg-secondaryVariant">
                        <Link href={''} className="col-span-1 pl-1 left-0" onClick={() => handleDeleteFavorite(kw.uid)}>
                            delete
                        </Link>

                        { editMode ?
                            <input className='col-span-1 min-w-8 max-w-28 h-6 w-10'
                                    type="text"
                                    defaultValue={kw.order || ''}
                                    onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleOrderBlur(event, kw) }
                                    placeholder="order"
                            />
                            :
                            <div className='col-span-1 min-w-8 max-w-28 h-6 w-10'>{kw.order < 100 ? kw.order : ''}</div>
                        }

                        <div className={`col-span-3 hover:text-tertiary ${kw.order < 100 ? "font-semibold" : ""}`} onClick={() => handleSelectFavorite(kw)}>
                            <div className='underline underline-offset-4 decoration-primary'>{`${kw.title} ${kw.total ? '(' + kw.total + ')': ''}` }</div>
                            { kw.originalTitle ? <div className='pr-2 w-fit'>{kw.originalTitle}</div> : <></>}
                            { kw.subtitle ? <div>{kw.subtitle}</div> : <></>}
                            { kw.lastEpisode ? <div>{kw.lastEpisode}</div> : <></>}
                        </div>

                        { editMode ?
                            <div className='col-span-3 right-0 items-center max-w-48'>
                                <div className='flex flex-col'>
                                    <div className='h-6'></div>
                                    <input
                                        className='min-w-8 max-w-48 h-6 w-48'
                                        type="text"
                                        defaultValue={kw.originalTitle || ''}
                                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleOriginalTitleBlur(event, kw) }
                                        placeholder="original title"
                                    />
                                    <input
                                        className='min-w-8 max-w-48 h-6 w-48'
                                        type="text"
                                        defaultValue={kw.subtitle || ''}
                                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleSubtitleBlur(event, kw) }
                                        placeholder="subtitle"
                                    />
                                    <input
                                        className='min-w-8 max-w-28 h-6 w-10'
                                        type="text"
                                        defaultValue={kw.lastEpisode || ''}
                                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleLastEpisodeBlur(event, kw) }
                                        placeholder="episode"
                                    />
                                </div>
                            </div>
                        :
                            <div className='col-span-3 right-0 items-center w-36'></div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
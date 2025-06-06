import React, { useState } from 'react';
import Link from 'next/link'
import RemovableItem from '@/components/molecules/RemovableItem';
import { useFavorites } from '../../hooks';
import { FavoriteType } from '../../domain';


interface FavoritesProps {
    className?: string,
}


export const Favorites: React.FC<FavoritesProps> = ({ className }) => {
    const useFavorite = useFavorites();
    const [loadMode, setLoadMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [data, setData] = React.useState('')

    // const handleSelect = async (selected: FavoriteType) => {
    //     onSelected(selected)
    //     // notice: intentionaly no navigate to /search/keywords or other pages, because here we should not know about how pages are structured
    //     // but is it worth it to keep that principle? what about Link href?
    // }

    const handleDelete = async (uid: string) => {
        if (useFavorite.items) {
            useFavorite.remove(uid);
        }
    }

    const handleLastEpisodeBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (Number.parseInt(event.target.value) !== selected.lastEpisode ) {
            useFavorite.addOrUpdate({ ...selected, lastEpisode: Number.parseInt(event.target.value) });
        }
    };

    const handleOrderBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.order?.toString() ) {
            useFavorite.addOrUpdate({ ...selected, order: Number(event.target.value) });
        }
    };

    const handleOriginalTitleBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.originalTitle ) {
            useFavorite.addOrUpdate({ ...selected, originalTitle: event.target.value });
        }
    };

    const handleSubtitleBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteType) => {
        if (event.target.value !== selected.subtitle ) {
            useFavorite.addOrUpdate({ ...selected, subtitle: event.target.value });
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
                useFavorite.load(newFavorites);
            } catch (error) {
                // display error latet
                alert(`there is an error with the json you try to load : ${error}`);
            }
        }
    };

    function toggleLoadMode(): void {
        setLoadMode(loadMode ? false : true);
    }

    function toggleEditMode(): void {
        setEditMode(editMode ? false : true);
    }

    const sample = JSON.stringify(
        [
            {
                "uid": "910906a2-95eb-4c8b-b560-91fe65754252",
                "title": "divine lord of the heavens",
                "lastEpisode": "28",
            },
            {
                "uid": "7526bc07-7eb1-41df-afd2-67b1bbeb94b0",
                "title": "martial peak",
                "lastEpisode": "19",
            }
        ],
        null, 4
    )

    const keywords = (fav: FavoriteType) => encodeURIComponent(`${fav.title} ${fav.lastEpisode ? fav.lastEpisode : ''}`)

    return (
        <div className={className}>
            <div className='text-md pl-4'>Favorite animes serve the matching algorithm on the search page</div>
            <div className='favorties-header pb-4'>
            <Link href={''} className="pr-4" onClick={toggleLoadMode}>load</Link>
            <Link href={''} className="pr-4" onClick={toggleEditMode}>edit</Link>
                <Link href={''} className="pr-4" onClick={useFavorite.reset}>reset</Link>

                {loadMode ?
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
                { useFavorite.items?.map(kw => (
                    <RemovableItem onDelete={handleDelete} key={kw.uid} id={kw.uid}>
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

                        <Link className={`col-span-5 hover:text-tertiary ${kw.order < 100 ? "font-semibold" : ""}`} href={`/?keywords=${keywords(kw)}`} >
                            <div className="col-span-5 hover:text-tertiary" >
                                <div className='underline underline-offset-4 decoration-primary'>{kw.title}</div>
                                { kw.originalTitle ? <div className='pr-2 w-fit'>{kw.originalTitle}</div> : <></>}
                                { kw.subtitle ? <div>{kw.subtitle}</div> : <></>}
                                { kw.lastEpisode ? <div>{kw.lastEpisode}</div> : <></>}
                            </div>
                        </Link>

                        { editMode ?
                            <div className='col-span-5 right-0 items-center max-w-48'>
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
                    </RemovableItem>
                ))}
            </div>
        </div>
    );
};

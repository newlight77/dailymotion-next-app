import React, { useState } from 'react';
import Link from 'next/link'
import { useAnimelist } from '../../hooks/AnimeListProvider';
import { AnimeType } from '../../domain/model/anime';
import AnimeCard from './AnimeCard';



type Props = {
    className?: string,
}

const AnimeList: React.FC<Props> = ({className}) => {
    const { items, loadData, reset, clear } = useAnimelist();
    const [data, setData] = useState('')
    const [editMode, setEditMode] = useState(false);
    const [filterKeywords, setFilterKeywords] = useState('');
    const [exclusions, setExclusions] = useState('');

    const handleAddToFavorites = (anime: AnimeType) => {
        console.log('add to favorites', anime);
    };

    const handleFollowAnime = (anime: AnimeType) => {
        console.log('follow anime', anime);
    };

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    const onExclusionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExclusions(event.target.value);
    };

    function toggleEditMode(): void {
        setEditMode(editMode ? false : true);
    }

    const handleReloadDataChange = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (event.target.value !== data) {
        setData(event.target.value);
    }
    };

    const reloadData = () => {
        if (data) {
            try {
                const newAnimelist = (JSON.parse(data) as AnimeType[])
                .reduce<AnimeType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
                loadData(newAnimelist);
            } catch (error) {
                // display error latet
                alert(`there is an error with the json you try to load : ${error}`);
            }
        }
    };

    const sample = JSON.stringify(
        [
        ], null, 4
    )

    return (
        <div className={className}>

            {
                items && items?.length > 0 ?
                <div className="pt-4 pb-4 text-primary">
                    <input
                        type="text"
                        value={filterKeywords}
                        onChange={onFilterInputChange}
                        placeholder="filter on title, description or owner"
                    />
                    <input
                        type="text"
                        value={exclusions}
                        onChange={onExclusionsInputChange}
                        placeholder="exclusions on title, description or owner"
                    />
                </div>
                :
                <></>
            }

            <div className='animelist-header p-4'>
                <Link href={''} className="pr-4" onClick={toggleEditMode}>edit</Link>
                <Link className='pr-4' href={''} onClick={clear}>clear</Link>
                <Link href={''} className="pr-4" onClick={reset}>reset</Link>

                {editMode ?
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
                { items ?.map(anime => (
                        <AnimeCard
                            className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 3xl:w-1/6 4xl:w-1/7 5xl:w-1/8 h-auto"
                            key={anime.uid}
                            anime={anime}
                            onAddToFavorite={handleAddToFavorites}
                            onFollowAnime={handleFollowAnime}>
                        </AnimeCard>
                    ))
                }
            </div>
        </div>
    );
};

export default AnimeList;

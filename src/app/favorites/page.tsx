"use client"
import Favorites, { FavoriteType } from '@/components/objects/Favorites';
import { useLocalStorage } from '@/shared/useLocalStorage';
import React, { useState } from 'react';
import serie from '../../data/series';


const LOWEST_ORDER = Number.MAX_VALUE;

const FAVORITES: FavoriteType[] = [
    ...serie,
]
// dedup
.reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], [])
// .sort((a: FavoriteType, b: FavoriteType) => a.title.localeCompare(b.title));
.sort((a: FavoriteType, b: FavoriteType) => (a.order ?? LOWEST_ORDER) - (b.order ?? LOWEST_ORDER));


const FavoritesPage: React.FC = () => {

   const [newKeywords, setNewKeywords] = useState<string>('');
    const [newToFavortie, setNewToFavorite] = useState<FavoriteType>();
    const [favorites, setFavorites] = useLocalStorage<FavoriteType[]>(`favorites`, FAVORITES);
    const [editMode, setEditMode] = useState(false);
    const [show, setShow] = React.useState(false)
    const [data, setData] = React.useState('')


    const handleSelectFavorite = (favorite: FavoriteType) => {
        setNewKeywords(`${favorite.title} ${favorite.originalTitle ? favorite.originalTitle : ''} ${favorite.originalTitle ? favorite.lastEpisode : ''}`);
    };


    return (
        <div className='container w-full'>
            <h2 className='title text-4xl p-1 md:p-4 capitalize'>my favorites videos</h2>

            <div className="pb-4 pt-4 md:absolute md:z-100 md:p-2 md:m-1 w-2/4">
                <Favorites onSelected={handleSelectFavorite} newFavorite={newToFavortie} />
            </div>

        </div>
    );
};

export default FavoritesPage;

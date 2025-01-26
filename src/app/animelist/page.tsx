"use client"
import AnimeList from '@/search-context/search-provider/view/animelist/AnimeList';
import React from 'react';


const AnimelistPage: React.FC = () => {
    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>anime list</h2>
            <div className='pb-4 pt-4 md:absolute md:z-100 md:p-2 md:m-1 sm:max-w-screen-sm md:max-w-screen-xl'>
                <AnimeList />
            </div>
        </div>
    );
};

export default AnimelistPage;

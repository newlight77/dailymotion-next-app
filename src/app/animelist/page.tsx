"use client"
import { AnimeList } from '@/bounded-contexts/animelist-context';
import React from 'react';


const AnimelistPage: React.FC = () => {
    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>anime list</h2>
            <div className='pb-4 pt-4 md:absolute md:z-100'>
                <AnimeList />
            </div>
        </div>
    );
};

export default AnimelistPage;

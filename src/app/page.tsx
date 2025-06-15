"use client"

import React from 'react';
import AnimelistPage from './animelist/page';


const HomePage: React.FC = () => {
    return (
        <div className="w-full">
            <AnimelistPage/>
        </div>
    );
};

export default HomePage;
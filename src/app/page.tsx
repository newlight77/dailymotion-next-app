"use client"
import React from 'react';
import Search from '@/search-context/search-provider/components/Search/Search';


const HomePage: React.FC = () => {

    return (
        <div className='container'>
            <Search keywords={''}></Search>
        </div>
    );
};

export default HomePage;
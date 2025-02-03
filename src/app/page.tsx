"use client"

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import Search from '@/bounded-contexts/video-search-context/view/search/Search';

const SearchWithParams: React.FC = () => {
    const searchParams = useSearchParams()
    const newKeywords = searchParams.get('keywords') || ''

    return (
        <Search
            keywords={newKeywords}>
        </Search>
    );
}


const HomePage: React.FC = () => {

    return (
        <div className="w-full">
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>search videos</h2>

            <Suspense>
                <SearchWithParams></SearchWithParams>
            </Suspense>
        </div>
    );
};

export default HomePage;
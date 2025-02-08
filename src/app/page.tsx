"use client"

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import VideoSearch from '@/bounded-contexts/videosearch-context/view/search/VideoSearch';

const SearchWithParams: React.FC = () => {
    const searchParams = useSearchParams()
    const newKeywords = searchParams.get('keywords') || ''

    return (
        <VideoSearch
            keywords={newKeywords}>
        </VideoSearch>
    );
}


const HomePage: React.FC = () => {

    return (
        <div className="w-full">
            <h2 className='title text-3xl m-1 md:p-4 capitalize'>search videos</h2>

            <Suspense>
                <SearchWithParams></SearchWithParams>
            </Suspense>
        </div>
    );
};

export default HomePage;
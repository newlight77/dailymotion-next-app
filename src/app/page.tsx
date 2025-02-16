"use client"

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import { VideoSearch } from '@/bounded-contexts/videosearch-context';

const VideoSearchWithParams: React.FC = () => {
    const searchParams = useSearchParams()
    const newKeywords = searchParams.get('keywords') || ''

    return (
        <VideoSearch
            keywords={newKeywords}>
        </VideoSearch>
    );
}


const VideoSearchPage: React.FC = () => {

    return (
        <div className="w-full">
            <h2 className='title text-3xl m-1 md:p-4 capitalize'>search videos</h2>

            <Suspense>
                <VideoSearchWithParams></VideoSearchWithParams>
            </Suspense>
        </div>
    );
};

export default VideoSearchPage;
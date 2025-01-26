"use client"
import React from 'react';
import { useRouter } from "next/navigation";

import SearchHistory from '../../search-context/search-provider/view/search/SearchHistory';
import LastViews from '@/search-context/search-provider/view/lastviews/LastViews';
import { LastViewType } from '@/search-context/search-provider/domain/anime';


const HistoryPage: React.FC = () => {
    const router = useRouter()

    const handleSelectSearchHistory = (selectedKeywords: string) => {
        const title = encodeURIComponent(selectedKeywords)
        router.push(`/?keywords=${title}`);
    };

    const handleSelectRecentView = (selectedLastView: LastViewType) => {
        const title = encodeURIComponent(`${selectedLastView.title} ${selectedLastView.episode}`)
        router.push(`/?keywords=${title}`);
    };

    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>my recent searches and views</h2>
            <div className='history md:grid grid-cols-2 gap-4 sm:max-w-screen-sm md:max-w-screen-xl'>
                <div className="pt-2">
                    <h3 className='title text-2xl p-1 md:p-4 capitalize'>last views</h3>
                    <LastViews onSelected={handleSelectRecentView} />
                </div>
                <div className="pt-2">
                    <h3 className='title text-2xl p-1 md:p-4 capitalize'>last searches</h3>
                    <SearchHistory onSelected={handleSelectSearchHistory} />
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;

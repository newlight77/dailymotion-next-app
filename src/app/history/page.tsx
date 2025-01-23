"use client"
import React from 'react';
import { useRouter } from 'next/navigation'

import SearchHistory from '../../search-context/search-provider/components/search/SearchHistory';
import LastViews, { LastViewType } from '@/search-context/search-provider/components/lastviews/LastViews';


const HistoryPage: React.FC = () => {
    const router = useRouter()

    const handleSelectSearchHistory = (selectedKeywords: string) => {
        router.push(`?keywords=${selectedKeywords}`)
    };

    const handleSelectRecentView = (selectedLastView: LastViewType) => {
        router.push(`?keywords=${selectedLastView.title} ${selectedLastView.episode}`);
    };

    return (
        <div className='container w-full'>
            <h2 className='title text-4xl p-1 md:p-4 capitalize'>my recent searches and views</h2>
            <div className='history md:flex flex-wrap'>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <h3 className='title text-4xl p-1 md:p-4 capitalize'>last searches</h3>
                    <SearchHistory onSelected={handleSelectSearchHistory} />
                </div>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <h3 className='title text-4xl p-1 md:p-4 capitalize'>last views</h3>
                    <LastViews onSelected={handleSelectRecentView} />
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;

"use client"
import React from 'react';
// import { useNavigate } from 'react-router-dom';

import SearchHistory from '../../search-context/search-provider/components/Search/SearchHistory';
import LastViews, { LastViewType } from '@/search-context/search-provider/components/lastviews/LastViews';


const HistoryPage: React.FC = () => {
    // const navigate = useNavigate();

    const handleSelectSearchHistory = (selectedKeywords: string) => {
        // navigate(`/search/${selectedKeywords}`);
    };

    const handleSelectRecentView = (selectedLastView: LastViewType) => {
        // navigate(`/search/${selectedLastView.title} ${selectedLastView.episode}`);
    };

    return (
        <div className='container w-full'>
            <h2 className='title text-4xl p-1 md:p-4 capitalize'>my recent searches and views</h2>
            <div className='history md:flex flex-wrap'>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <SearchHistory onSelected={handleSelectSearchHistory} />
                </div>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <LastViews onSelected={handleSelectRecentView} />
                </div>
            </div>

        </div>
    );
};

export default HistoryPage;

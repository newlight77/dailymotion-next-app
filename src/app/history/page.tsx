"use client"
import React from 'react';

import { LastViews, VideoSearchHistory } from '@/donghua-context/user-preferences-feature';


const HistoryPage: React.FC = () => {

    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>my recent searches and views</h2>
            <div className='history md:grid grid-cols-2 gap-4 sm:max-w-screen-sm md:max-w-screen-xl'>
                <div className="pt-2">
                    <h3 className='title text-2xl p-1 md:p-4 capitalize'>last views</h3>
                    <LastViews />
                </div>
                <div className="pt-2">
                    <h3 className='title text-2xl p-1 md:p-4 capitalize'>last searches</h3>
                    <VideoSearchHistory />
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;

"use client"
import React from 'react';
import dynamic from 'next/dynamic';

const UpcomingScheduleFeaturedRegion = dynamic(
    () => import('@/donghua-context/schedule-feature').then(m => m.UpcomingScheduleFeaturedRegion),
    { ssr: false }
);


const SchedulePage: React.FC = () => {
    return (
        <div className='w-full'>
            <UpcomingScheduleFeaturedRegion />
        </div>
    );
};

export default SchedulePage;

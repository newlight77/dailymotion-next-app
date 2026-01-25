"use client"
import React from 'react';
import dynamic from 'next/dynamic';

const FeaturedNewSeriesRegion = dynamic(
    () => import('@/donghua-context/schedule-feature').then(m => m.FeaturedNewSeriesRegion),
    { ssr: false }
);


const SchedulePage: React.FC = () => {
    return (
        <div className='w-full'>
            <FeaturedNewSeriesRegion />
        </div>
    );
};

export default SchedulePage;

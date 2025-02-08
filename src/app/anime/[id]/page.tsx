"use client"
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AnimeDetail } from '@/bounded-contexts/animelist-context';


const AnimePage: React.FC = () => {
    const { id } = useParams<{ id: string}>();
    const mode = useSearchParams().get('mode') || '';

    // console.log('AnimePage', id, mode)

    return (
        <div className='w-full'>
            <AnimeDetail id={id} mode={mode}></AnimeDetail>
        </div>
    );
};

export default AnimePage;

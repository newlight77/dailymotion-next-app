"use client"
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Search from '@/search-context/search-provider/components/search/Search';


const SearchPage: React.FC = () => {
    const { keywords } = useParams<{ keywords: string}>();

    useEffect(() => {
        console.log('params.id', keywords);

    }, [keywords]);

    return (
        <div className='container w-full'>
            <Search keywords={keywords}></Search>
        </div>
    );
};

export default SearchPage;

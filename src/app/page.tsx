"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation'
import Search from '@/search-context/search-provider/components/search/Search';


const HomePage: React.FC = () => {
    const searchParams = useSearchParams()
    const keywords = searchParams.get('keywords') || undefined
    console.log('HomePage keywords', keywords);

    return (
        <div className='container'>
            <Search keywords={keywords}></Search>
        </div>
    );
};

export default HomePage;
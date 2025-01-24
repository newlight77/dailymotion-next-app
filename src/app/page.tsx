"use client"

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import Search from '@/search-context/search-provider/components/search/Search';
import Collapsable from '@/components/molecules/Collapsable';
import Favorites, { FavoriteType } from '@/search-context/search-provider/components/favorites/Favorites';


type Props = {
    keywords?: string,
    className?: string
}

const SearchWithParams: React.FC<Props> = ({keywords, className}) => {
    const searchParams = useSearchParams()
    const newKeywords = searchParams.get('keywords') || keywords

    return (
        <Search
            className={className}
            keywords={newKeywords}>
        </Search>
    );
}


const HomePage: React.FC = () => {
    const [keywords, setKeywords] = React.useState<string>();

    const handleSelectFavorite = (favorite: FavoriteType) => {
        setKeywords(`${favorite.title} ${favorite.originalTitle ? favorite.originalTitle: ''} ${favorite.lastEpisode ? favorite.lastEpisode : ''}`);
    };

    return (
        <div className="w-full">
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>search videos</h2>

            <Collapsable
                className="pb-4 pt-4 right-0 md:absolute md:z-100 md:p-2 md:m-1"
                title={'My favorites'}
                collapsedLabel={'show my favorites'}>
                <Favorites className='max-w-screen-sm' onSelected={handleSelectFavorite} />
            </Collapsable>

            <Suspense>
                <SearchWithParams keywords={keywords}></SearchWithParams>
            </Suspense>
        </div>
    );
};

export default HomePage;
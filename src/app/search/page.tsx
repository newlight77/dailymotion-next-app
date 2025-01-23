"use client"
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Search from '@/search-context/search-provider/components/search/Search';
import Collapsable from '@/components/molecules/Collapsable';
import Favorites, { FavoriteType } from '@/search-context/search-provider/components/favorites/Favorites';


type Props = {
    keywords?: string
}

const SearchWithParams: React.FC<Props> = ({keywords}) => {
    const searchParams = useSearchParams()
    const newKeywords = searchParams.get('keywords') || keywords

    return (
        <Search keywords={newKeywords}></Search>
    );
}

const SearchPage: React.FC = () => {
    const [keywords, setKeywords] = React.useState<string>();

    const handleSelectFavorite = (favorite: FavoriteType) => {
        setKeywords(`${favorite.title} ${favorite.originalTitle ? favorite.originalTitle: ''} ${favorite.lastEpisode ? favorite.lastEpisode : ''}`);
    };

    return (
        <div className='container w-full'>
            <h2 className='title p-1 md:p-3'>Search Videos</h2>

            <div className="pb-4 pt-4 right-0 md:absolute md:z-100 md:p-2 md:m-1 w-1/3">
                <Collapsable title={'My favorites'} collapsedLabel={'show my favorites'}>
                    <Favorites onSelected={handleSelectFavorite} />
                </Collapsable>
            </div>

            <div className='search'>
                <Suspense>
                    <SearchWithParams keywords={keywords}></SearchWithParams>
                </Suspense>
            </div>
        </div>
    );
};

export default SearchPage;

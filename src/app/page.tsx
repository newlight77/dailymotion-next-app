"use client"

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import Search from '@/search-context/search-provider/view/search/Search';
import Collapsable from '@/components/molecules/Collapsable';
import Favorites from '@/search-context/search-provider/view/favorites/Favorites';
import { FavoriteType } from '@/search-context/search-provider/domain/anime';


const SearchWithParams: React.FC = () => {
    const searchParams = useSearchParams()
    const newKeywords = searchParams.get('keywords') || ''

    return (
        <Search
            keywords={newKeywords}>
        </Search>
    );
}


const HomePage: React.FC = () => {
    const [hideShow, toggleHideShow] = React.useState<boolean>();
    const router = useRouter()

    const handleSelectFavorite = (favorite: FavoriteType) => {
        toggleHideShow(!hideShow);
        const title = encodeURIComponent(`${favorite.title} ${favorite.originalTitle ? favorite.lastEpisode : ''}`)
        router.push(`/?keywords=${title}`);
    };


    return (
        <div className="w-full">
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>search videos</h2>

            <Collapsable
                hideShow={hideShow}
                className="pb-4 pt-4 right-0 md:absolute md:z-100 md:p-2 md:m-1"
                title={'My favorites'}
                collapsedLabel={'show my favorites'}>
                <Favorites className='max-w-screen-sm' onSelected={handleSelectFavorite} />
            </Collapsable>

            <Suspense>
                <SearchWithParams></SearchWithParams>
            </Suspense>
        </div>
    );
};

export default HomePage;
"use client"
import React, { useEffect, useState } from 'react';
import Collapsable from '@/components/molecules/Collapsable';

import SearchBar from './SearchBar';
import VideoList from './VideoList';
import { MetaVideo, SearchResponse, VideoType } from '../../service/searchVideo';
import Favorites, { FavoriteType } from '../favorites/Favorites';
import { useFollowings } from '../followings/FollowingsProvider';
import { useLastViews } from '../lastviews/LastViewsProvider';
import { useSearchHistory } from './SearchHistoryProvider';

type Props = {
    keywords: string
}

const HomePage: React.FC<Props> = ({keywords}) => {
    const [searchResults, setSearchResults] = useState<MetaVideo[]>([]);
    const [newKeywords, setNewKeywords] = useState<string>('');
    const useFollowing = useFollowings();
    const useLastView = useLastViews();
    const useSearchHist = useSearchHistory();

    useEffect(() => {
        setNewKeywords(keywords);
    }, [keywords]);

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results } = searchResponse;
        setSearchResults(results?.list || []);
        useSearchHist.addOrUpdate({uid: crypto.randomUUID().toString(), keywords: searchResponse.search});
    };

    const handleAddLastView = (video: VideoType) => {
        useLastView.addOrUpdate({uid: crypto.randomUUID().toString(), videoId: video.videoId, title: video.title, episode: video.episode, owner: video.owner, link: video.link});
    };

    const handleFollowOwner = (video: VideoType) => {
        useFollowing.addOrUpdate({uid: crypto.randomUUID().toString(), owner: video.owner, order: 0});
    };

    const handleSelectFavorite = (favorite: FavoriteType) => {
        setNewKeywords(`${favorite.title} ${favorite.originalTitle ? favorite.originalTitle: ''} ${favorite.lastEpisode ? favorite.lastEpisode : ''}`);
    };

    return (
        <div className='container'>
            <h2 className='title text-4xl p-1 md:p-4'>Search Videos</h2>

            <div className="pb-4 pt-4 right-0 md:absolute md:z-100 md:p-2 md:m-1 w-1/3">
                <Collapsable title={'My favorites'} collapsedLabel={'show my favorites'}>
                    <Favorites onSelected={handleSelectFavorite} />
                </Collapsable>
            </div>
            <div className='search'>
                <div className='search-bar'>
                    <SearchBar onSearch={handleSearch} newKeywords={newKeywords}/>
                </div>

                <div className='search-results'>
                    <VideoList videos={searchResults} onAddLastView={handleAddLastView} onFollowOwner={handleFollowOwner}/>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
"use client"
import React, { useState } from 'react';
import SearchBar from '../components/organisms/SearchBar';
import VideoList from '../components/objects/VideoList';
import { MetaVideo, SearchResponse } from '../service/searchVideo';
import Favorites, { FavoriteType } from '@/components/objects/Favorites';
import SearchHistory from '@/components/objects/SearchHsitory';
import ViewHistory, { LastView } from '@/components/objects/ViewHistory';
import Followings, { Following } from '@/components/objects/Followings';
import Collapsable from '@/components/molecules/Collapsable';


const HomePage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<MetaVideo[]>([]);
    const [newKeywords, setNewKeywords] = useState<string>('');

    const [newToHsitory, setNewToHistory] = useState<string>('');
    const [newToFavortie, setNewToFavorite] = useState<FavoriteType>();
    const [newToLastview, setNewToLastView] = useState<LastView>();
    const [newToFollowingFollowing, setNewToFollowingUser] = useState<Following>();

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results } = searchResponse;
        setSearchResults(results?.list || []);
        setNewToHistory(searchResponse.search);
    };

    const handleSelectVideo = (selectedLastView: LastView) => {
        setNewToLastView(selectedLastView);
    };

    const handleFollowUser = (followingUser: Following) => {
        setNewToFollowingUser(followingUser);
    };

    const handleSelectFollowing = (selectedFollowing: Following) => {
        setNewKeywords(selectedFollowing.owner);
    };

    const handleSelectSearchHistory = (selectedKeywords: string) => {
        setNewKeywords(selectedKeywords);
    };

    const handleSelectRecentView = (selectedLastView: LastView) => {
        setNewKeywords(`${selectedLastView.title} ${selectedLastView.episode ? selectedLastView.episode : ''}`);
    };

    const handleSelectFavorite = (favorite: FavoriteType) => {
        setNewKeywords(`${favorite.title} ${favorite.originalTitle ? favorite.originalTitle : ''} ${favorite.originalTitle ? favorite.lastEpisode : ''}`);
    };

    const handleAddSearchToFavorite = (keywords: string) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: keywords, order: 0});
    };

    const handleAddRecentViewToFavorite = (lastview: LastView) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: lastview.title, lastEpisode: lastview.episode, order: 0});
    };

    const handleAddViewToFollowingUser = (following: Following) => {
        setNewToFollowingUser(following);
    };

    return (
        <div className='container'>
            <h2 className='title text-4xl p-1 md:p-4'>Search Videos</h2>

            <div className="pb-4 pt-4 right-0 md:absolute md:z-100 md:p-2 md:m-1 w-1/3">
                <Collapsable title={'My favorites'} collapsedLabel={'show my favorites'}>
                    <Favorites onSelected={handleSelectFavorite} newFavorite={newToFavortie} />
                </Collapsable>
            </div>
            <div className='search'>
                <div className='search-bar'>
                    <div className='history md:flex flex-wrap'>
                        <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                            <Collapsable title={'My favorites'} collapsedLabel={'show my favorites'}>
                                <SearchHistory onSelected={handleSelectSearchHistory} onAddToFavorite={handleAddSearchToFavorite} newKeywords={newToHsitory} />
                            </Collapsable>
                        </div>
                        <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                            <Collapsable title={'My recent searches'} collapsedLabel={'show my recent searches'}>
                                <ViewHistory onSelected={handleSelectRecentView} onAddToFavorite={handleAddRecentViewToFavorite} onFollowOwner={handleAddViewToFollowingUser} newLastView={newToLastview} />
                            </Collapsable>
                        </div>
                        <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                            <Collapsable title={'My last views'} collapsedLabel={'show my followings'}>
                                <Followings onSelected={handleSelectFollowing} newFollowing={newToFollowingFollowing} />
                            </Collapsable>
                        </div>
                    </div>
                    <SearchBar onSearch={handleSearch} newKeywords={newKeywords}/>
                </div>

                <div className='search-results'>
                    <VideoList videos={searchResults} onSelected={handleSelectVideo} onFollowOwner={handleFollowUser}/>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
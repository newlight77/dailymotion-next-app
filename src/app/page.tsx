"use client"
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import VideoList from '../components/VideoList';
import { MetaVideo, SearchResponse } from '../service/searchVideo';
import Favorites, { FavoriteWithEpisodes } from '@/components/Favorites';
import SearchHistory from '@/components/SearchHsitory';
import ViewHistory, { LastView } from '@/components/ViewHistory';
import FollowingChannels, { Channel } from '@/components/FollowingChannels';


const HomePage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<MetaVideo[]>([]);
    const [newKeywords, setNewKeywords] = useState<string>('');

    const [newToHsitory, setNewToHistory] = useState<string>('');
    const [newToFavortie, setNewToFavorite] = useState<FavoriteWithEpisodes>();
    const [newToLastview, setNewToLastView] = useState<LastView>();
    const [newToFollowingChannel, setNewToFollowingChannel] = useState<Channel>();

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results } = searchResponse;
        setSearchResults(results?.list || []);
        setNewToHistory(searchResponse.search);
    };

    const handleSelectVideo = (selectedLastView: LastView) => {
        setNewToLastView(selectedLastView);
    };

    const handleSelectChannel = (selectedChannel: Channel) => {
        setNewKeywords(selectedChannel.name);
    };

    const handleSelectSearchHistory = (selectedKeywords: string) => {
        setNewKeywords(selectedKeywords);
    };

    const handleSelectRecentView = (selectedLastView: LastView) => {
        setNewKeywords(`${selectedLastView.title} ${selectedLastView.episode ? selectedLastView.episode : ''}`);
    };

    const handleSelectFavorite = (favorite: FavoriteWithEpisodes) => {
        setNewKeywords(`${favorite.title} ${favorite.originalTitle ? favorite.originalTitle : ''} ${favorite.originalTitle ? favorite.lastEpisode : ''}`);
    };

    const handleAddSearchToFavorite = (keywords: string) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: keywords});
    };

    const handleAddRecentViewToFavorite = (lastview: LastView) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: lastview.title, lastEpisode: lastview.episode});
    };

    const handleAddViewToFollowingChannel = (channel: Channel) => {
        setNewToFollowingChannel(channel);
    };

    return (
        <div>
            <header>

            </header>

            <main className='container min-w-400 md:max-w-screen-xl lg:max-w-screen-2xl'>
                <h1 className='title text-4xl p-1'>My favorites Videos</h1>

                <div className="pb-4 pt-4 right-0 md:absolute md:z-100 md:p-2 md:m-1">
                    <Favorites onSelected={handleSelectFavorite} newFavorite={newToFavortie} />
                </div>
                <div className='search'>
                    <div className='search-bar md:p-4'>
                        <div className='history md:flex flex-wrap'>
                            <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                                <SearchHistory onSelected={handleSelectSearchHistory} onAddToFavorite={handleAddSearchToFavorite} newKeywords={newToHsitory} />
                            </div>
                            <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                                <ViewHistory onSelected={handleSelectRecentView} onAddToFavorite={handleAddRecentViewToFavorite} onFollowChannel={handleAddViewToFollowingChannel} newLastView={newToLastview} />
                            </div>
                            <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                                <FollowingChannels onSelected={handleSelectChannel} newChannel={newToFollowingChannel} />
                            </div>
                        </div>
                        <SearchBar onSearch={handleSearch} newKeywords={newKeywords}/>
                    </div>

                    <div className='search-results'>
                        <VideoList videos={searchResults} onSelected={handleSelectVideo} onSelectedChannel={handleSelectChannel}/>
                    </div>
                </div>
            </main>

            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            </footer>
        </div>
    );
};

export default HomePage;
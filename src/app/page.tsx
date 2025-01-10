"use client"
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import VideoList from '../components/VideoList';
import { MetaVideo, SearchResponse } from '../service/searchVideo';
import Favorites, { FavoriteWithEpisodes } from '@/components/Favorites';
import SearchHistory from '@/components/SearchHsitory';
import ViewHistory, { LastView } from '@/components/ViewHistory';


const HomePage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<MetaVideo[]>([]);
    const [newKeywords, setNewKeywords] = useState<string>('');

    const [newToHsitory, setNewToHistory] = useState<string>('');
    const [newToFavortie, setNewToFavorite] = useState<FavoriteWithEpisodes>();
    const [newToLastview, setNewToLastView] = useState<LastView>();

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results } = searchResponse;
        setSearchResults(results?.list || []);
        setNewToHistory(searchResponse.search);
    };

    const handleSelectVideo = (selectedLastView: LastView) => {
        setNewToLastView(selectedLastView);
    };

    const handleSelectSearchHistory = (selectedKeywords: string) => {
        setNewKeywords(selectedKeywords);
    };

    const handleSelectRecentView = (selectedLastView: LastView) => {
        setNewKeywords(`${selectedLastView.title} ${selectedLastView.episode ? selectedLastView.episode : ''}`);
    };

    const handleSelectFavorite = (favorite: FavoriteWithEpisodes) => {
        setNewKeywords(`${favorite.title} ${favorite.lastEpisode ? favorite.lastEpisode : ''}`);
    };

    const handleAddSearchToFavorite = (keywords: string) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: keywords});
    };

    const handleAddRecentViewToFavorite = (lastview: LastView) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: lastview.title, lastEpisode: lastview.episode});
    };

    return (
        <div>
            <header>

            </header>

            <main className='container min-w-400 max-w-2000 p-1'>

                <Favorites onSelected={handleSelectFavorite} newFavorite={newToFavortie} />

                <div className='search'>
                    <div className='search-bar p-4'>
                        <h1>Dailymotion Video Search</h1>
                        <SearchBar onSearch={handleSearch} newKeywords={newKeywords}/>
                        <div className='history flex flex-wrap'>
                            <div className="basis-1/8 w-1/3">
                                <SearchHistory onSelected={handleSelectSearchHistory} onAddToFavorite={handleAddSearchToFavorite} newKeywords={newToHsitory} />
                            </div>
                            <div className="basis-1/8 w-1/3">
                                <ViewHistory onSelected={handleSelectRecentView} onAddToFavorite={handleAddRecentViewToFavorite} newLastView={newToLastview} />
                            </div>
                        </div>
                    </div>

                    <div className='search-results'>
                        <VideoList videos={searchResults} onSelected={handleSelectVideo}/>
                    </div>
                </div>
            </main>

            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            </footer>
        </div>
    );
};

export default HomePage;
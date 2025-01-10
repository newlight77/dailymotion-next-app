"use client"
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import VideoList from '../components/VideoList';
import { MetaVideo, SearchResponse } from '../service/searchVideo';
import Favorites, { FavoriteWithEpisodes } from '@/components/Favorites';
import SearchHistory from '@/components/SearchHsitory';
import css from 'styled-jsx/css';

const style = css`
    display: flex;
    bottom: 1rem;
    left: 50%;
    position: fixed;
    z-index: 100;
`

const HomePage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<MetaVideo[]>([]);
    const [searchKeywords, setSearchKeywords] = useState<string>('');
    const [newToHsitory, setNewToHistory] = useState<string>('');
    const [newToFavortie, setNewToFavorite] = useState<FavoriteWithEpisodes>();

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results } = searchResponse;
        setSearchResults(results?.list || []);
        setNewToHistory(searchResponse.search);
    };

    const handleSelectHistory = (selectedKeywords: string) => {
        setSearchKeywords(selectedKeywords);
    };

    const handleSelectFavorite = (favorite: FavoriteWithEpisodes) => {
        setSearchKeywords(`${favorite.title} ${favorite.lastEpisode ? favorite.lastEpisode : ''}`);
    };

    const handleAddToFavorite = (keywords: string) => {
        setNewToFavorite({id: crypto.randomUUID().toString(), title: keywords});
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
                        <SearchBar onSearch={handleSearch} newKeywords={searchKeywords}/>
                        <SearchHistory onSelected={handleSelectHistory} onAddToFavorite={handleAddToFavorite} newKeywords={newToHsitory} />
                    </div>

                    <div className='search-results'>
                        <VideoList videos={searchResults} />
                    </div>
                </div>
            </main>

            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            </footer>
        </div>
    );
};

export default HomePage;
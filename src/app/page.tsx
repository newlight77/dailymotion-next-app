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
    // const [error, setError] = useState<{ message: string } | undefined>(undefined);

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results } = searchResponse;
        setSearchResults(results?.list || []);
        setNewToHistory(searchResponse.search);
        // if (error) {
        //     setError(error);
        // }
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

                {/* <div className="favorites absolute z-100 right-0 p-1 h-200 w-1/5"> */}
                    <Favorites onSelected={handleSelectFavorite} newFavorite={newToFavortie} />
                {/* </div> */}

                <div className='search'>
                    <div className='search-bar p-4'>
                        {/* <div className='p-4'> */}
                            <div>
                                <h1>Dailymotion Video Search</h1>
                            </div>
                            <div >
                                <SearchBar onSearch={handleSearch} newKeywords={searchKeywords}/>
                            </div>
                            {/* <div >
                                {error && <p>Error: {error.message}</p>}
                            </div> */}
                        {/* </div> */}
                        {/* <div className='flex flex-row gap-4 p-4'> */}
                            {/* <div className="basis-1/8 p-4"> */}
                                <SearchHistory onSelected={handleSelectHistory} onAddToFavorite={handleAddToFavorite} newKeywords={newToHsitory} />
                            {/* </div> */}
                        {/* </div> */}
                    </div>

                    <div className='search-results'>
                        {/* <div className="p-4 "> */}
                            <VideoList videos={searchResults} />
                        {/* </div> */}
                    </div>
                </div>
            </main>

            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            </footer>
        </div>
    );
};

export default HomePage;
"use client"
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import VideoList from '../components/VideoList';
import { MetaVideo, SearchResponse } from '../service/searchVideo';
import SearchFavorites from '@/components/SearchFavorites';
import SearchHistory from '@/components/SearchHsitory';

const HomePage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<MetaVideo[]>([]);
    const [searchKeywords, setSearchKeywords] = useState<string>('');
    const [newToHsitory, setNewToHistory] = useState<string>('');
    const [newToFavortie, setNewTofavorite] = useState<string>('');
    const [error, setError] = useState<{ message: string } | undefined>(undefined);

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results, error } = searchResponse;
        setSearchResults(results?.list || []);
        setNewToHistory(searchResponse.search);
        if (error) {
            setError(error);
        }
    };

    const handleSelectHistory = (selectedKeywords: string) => {
        setSearchKeywords(selectedKeywords);
    };

    const handleSelectFavorite = (selectedKeywords: string) => {
        setSearchKeywords(selectedKeywords);
    };

    const handleAddToFavorite = (selectedKeywords: string) => {
        setNewTofavorite(selectedKeywords);
    };

    return (
        <div>
            <main>
                <div className='pl-32 p-16 items-center justify-center'>
                    <div>
                        <h1>Dailymotion Video Search</h1>
                    </div>
                    <div >
                        <SearchBar onSearch={handleSearch} newKeywords={searchKeywords}/>
                    </div>
                    <div >
                        {error && <p>Error: {error.message}</p>}
                    </div>
                </div>
                <div className='flex flex-row gap-4'>
                    <div className="basis-1/8 p-4">
                            {<SearchHistory onSelected={handleSelectHistory} onAddToFavorite={handleAddToFavorite} newKeywords={newToHsitory} />}
                    </div>
                    <div className="basis-1/8 p-4 ">
                            {<SearchFavorites onSelected={handleSelectFavorite} newKeywords={newToFavortie} />}
                    </div>
                </div>
                <div className="p-4 items-center justify-center">
                        {<VideoList videos={searchResults} />}
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
};

export default HomePage;
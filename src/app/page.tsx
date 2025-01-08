"use client"
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import VideoList from '../components/VideoList';
import { MetaVideo, SearchResponse } from '../service/searchVideo';

const HomePage: React.FC = () => {
    const [searchResults, setSearchResults] = useState<MetaVideo[]>([]);
    const [error, setError] = useState<{ message: string } | undefined>(undefined);

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results, error } = searchResponse;
        setSearchResults(results?.list || []);
        if (error) {
            setError(error);
        }
    };

    return (
        <div>
            <main>
                <div className='pl-32 p-16 items-center justify-center'>
                    <div>
                        <h1>Dailymotion Video Search</h1>
                    </div>
                    <div >
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <div >
                        {error && <p>Error: {error.message}</p>}
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
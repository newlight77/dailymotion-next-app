import React, { useEffect, useState } from 'react';
import { SearchParams, SearchResponse, searchVideos } from '../service/searchVideo';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

interface SearchBarProps {
    onSearch: (searchResponse: SearchResponse) => void;
}

type SearchKeywords = {
    id: string,
    keywords: string,
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [keywords, setKeywords] = useState('');
    const [searchHistory, setSearchHistory] = useLocalStorage<SearchKeywords[]>(`search-history`, []);

    useEffect(() => {
        if (keywords === '') {
            setKeywords(localStorage.getItem('lastSearch') || '');
        }
    }, [keywords]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
    };

    const handleKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        const params: SearchParams = {
            search: keywords,
            limit: 20,
            page: 1
        }
        const metaVideos = await searchVideos(params); // remove onSearch here
        onSearch(metaVideos);
        localStorage.setItem('lastSearch', keywords);
        if (searchHistory) {
            const searchKeywords: SearchKeywords = {id: crypto.randomUUID().toString(), keywords: keywords}
            const newSearchHistory = [...searchHistory, searchKeywords]
                .reduce<SearchKeywords[]>((acc, curr) => acc.some(item => item.keywords === curr.keywords) ? acc : [...acc, curr], []);
            setSearchHistory(newSearchHistory);
            console.log('searchHistory after ', newSearchHistory);
        }
    };

    const handleSearchKeywordsHistoryClick = async (keywords: string) => {
        setKeywords(keywords);
    }

    const handleSearchKeywordsHistoryDelete = async (id: string) => {
        if (searchHistory) {
            const newSearchHistory = searchHistory.filter(s => s.id !== id)
            setSearchHistory(newSearchHistory);
            console.log('searchHistory after ', newSearchHistory);
        }
    }

    const handleSearchKeywordsHistoryClear = async () => {
        if (searchHistory) {
            setSearchHistory([]);
            console.log('clearSearchHistory ', searchHistory);
        }
    }

    return (
        <div>
            <input
                type="text"
                value={keywords}
                onChange={handleInputChange}
                placeholder="Search videos by title or channel"
                onKeyUp={handleKeyup}
            />
            <button onClick={handleSearch}>Search</button>
            <h2>search history</h2>
            <div className='items-center'>
                <div>
                    { searchHistory?.map(s => (
                        <div key={crypto.randomUUID().toString()} className="flex flex-row gap-4 items-center">
                            <Link href={''} className="basis-1/8" onClick={() => handleSearchKeywordsHistoryDelete(s.id)}>
                                delete
                            </Link>
                            <Link href={''} className="basis-1/2" onClick={() => handleSearchKeywordsHistoryClick(s.keywords)}>
                                {s.keywords}
                            </Link>
                        </div>
                    ))}
                </div>
                <button onClick={handleSearchKeywordsHistoryClear}>clear history</button>
            </div>
        </div>
    );
};

export default SearchBar;
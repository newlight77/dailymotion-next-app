import React, { useEffect, useState } from 'react';
import { SearchParams, SearchResponse, searchVideos } from '../service/searchVideo';
// import { useLocalStorage } from '@/shared/useLocalStorage';

interface SearchBarProps {
    newKeywords?: string,
    onSearch: (searchResponse: SearchResponse) => void;
}

// type SearchKeywords = {
//     id: string,
//     keywords: string,
// }

const SearchBar: React.FC<SearchBarProps> = ({ newKeywords, onSearch }) => {
    const [keywords, setKeywords] = useState(newKeywords || '');
    // const [searchHistory, setSearchHistory] = useLocalStorage<SearchKeywords[]>(`search-history`, []);

    useEffect(() => {
        if (keywords === '') setKeywords(localStorage.getItem('lastSearch') || '');
        if (newKeywords) setKeywords(newKeywords);
    }, [newKeywords, keywords]);


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
        // if (searchHistory) {
        //     const searchKeywords: SearchKeywords = {id: crypto.randomUUID().toString(), keywords: keywords}
        //     const newSearchHistory = [...searchHistory, searchKeywords]
        //         .reduce<SearchKeywords[]>((acc, curr) => acc.some(item => item.keywords === curr.keywords) ? acc : [...acc, curr], []);
        //     setSearchHistory(newSearchHistory);
        //     console.log('searchHistory after ', newSearchHistory);
        // }
    };

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
        </div>
    );
};

export default SearchBar;
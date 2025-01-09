import React, { useEffect, useState } from 'react';
import { SearchParams, SearchResponse, searchVideos } from '../service/searchVideo';


interface SearchBarProps {
    newKeywords?: string,
    onSearch: (searchResponse: SearchResponse) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ newKeywords, onSearch }) => {
    const [keywords, setKeywords] = useState(newKeywords || '');

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
            limit: 30,
            page: 1
        }
        const metaVideos = await searchVideos(params); // remove onSearch here
        onSearch(metaVideos);
        localStorage.setItem('lastSearch', keywords);
    };

    return (
        <div className='flex flex-row gap-1'>
            <input
                className='basis-3/5'
                type="text"
                value={keywords}
                onChange={handleInputChange}
                placeholder="Search videos by title or channel"
                onKeyUp={handleKeyup}
            />
            <button className='basis-1/5' onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
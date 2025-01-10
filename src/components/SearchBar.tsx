import React, { useEffect, useState } from 'react';
import { SearchParams, SearchResponse, searchVideos } from '../service/searchVideo';


interface SearchBarProps {
    newKeywords?: string,
    onSearch: (searchResponse: SearchResponse) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ newKeywords, onSearch }) => {
    const [keywords, setKeywords] = useState(newKeywords || '');
    const [error, setError] = useState<{ message: string } | undefined>(undefined);

    useEffect(() => {
        if (keywords === '') setKeywords(localStorage.getItem('lastSearch') || '');
        if (newKeywords && newKeywords !== keywords) setKeywords(newKeywords);
        if (keywords !== '') handleSearch();
    }, [newKeywords]);


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
        const response = await searchVideos(params);
        onSearch(response);
        localStorage.setItem('lastSearch', keywords);

        if (response.error) {
            setError(error);
        }
    };

    return (
        <div className='flex flex-row gap-1'>
            <input
                className='basis-2/4'
                type="text"
                value={keywords}
                onChange={handleInputChange}
                placeholder="Search videos by title or channel"
                onKeyUp={handleKeyup}
            />
            <button className='basis-1/8' onClick={handleSearch}>Search</button>

            <div >
                {error && <p>Error: {error.message}</p>}
            </div>

        </div>
    );
};

export default SearchBar;
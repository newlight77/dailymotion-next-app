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
    }, [newKeywords]);

    useEffect(() => {
        if (keywords !== '') handleSearch()
    }, [keywords]);

    const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== keywords) {
            setKeywords(event.target.value);
        }
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
        <div className='p-1 md:p-2 md:w-1/5'>
            <div className='flex flex-row gap-1'>
                <input
                    className='basis-2/4 min-w-96'
                    type="text"
                    defaultValue={keywords}
                    onBlur={handleInputBlur}
                    placeholder="Search videos by title or channel"
                    onKeyUp={handleKeyup}
                />
                <button className='basis-1/8' onClick={handleSearch}>Search</button>

                <div >
                    {error && <p>Error: {error.message}</p>}
                </div>

            </div>
        </div>
    );
};

export default SearchBar;
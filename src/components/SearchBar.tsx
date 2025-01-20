import React, { useEffect, useState } from 'react';
import { SearchParams, SearchResponse, searchVideos } from '../service/searchVideo';


interface SearchBarProps {
    newKeywords?: string,
    onSearch: (searchResponse: SearchResponse) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ newKeywords, onSearch }) => {
    const [keywords, setKeywords] = useState(newKeywords || '');
    const [debouncedInpout, setDebouncedInpout] = useState('');
    const [error, setError] = useState<{ message: string } | undefined>(undefined);

    const delay = 1100;
    let timerId: NodeJS.Timeout = setTimeout(() => {}, delay);;

    function debounce(callback: () => void, timeout: number) {
        clearTimeout(timerId);
        timerId = setTimeout(() => callback(), timeout);
    }

    useEffect(() => {
        if (keywords === '') setKeywords(localStorage.getItem('lastSearch') || '');
        if (debouncedInpout === '' && keywords === '') setDebouncedInpout(localStorage.getItem('lastSearch') || '')
        if (newKeywords && newKeywords !== keywords) {
            setKeywords(newKeywords);
            setDebouncedInpout(newKeywords);
        }
    }, [newKeywords]);

    useEffect(() => {
        if (keywords !== '') handleSearch()
    }, [keywords]);

    useEffect(() => {
        if (debouncedInpout !== '') setKeywords(keywords)
    }, [debouncedInpout]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDebouncedInpout(event.target.value)
        debounce(() => {
            if (keywords !== debouncedInpout) {
                setKeywords(event.target.value)
            }
        }, delay)
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
                    className='basis-1/4 min-w-96'
                    type="text"
                    value={debouncedInpout}
                    onChange={handleInputChange}
                    placeholder="Search videos by title"
                    onKeyUp={handleKeyup}
                />
                {/* <button className='basis-1/8' onClick={handleSearch}>Search</button> */}

                <div >
                    {error && <p>Error: {error.message}</p>}
                </div>

            </div>
        </div>
    );
};

export default SearchBar;
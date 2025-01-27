import React, { useEffect, useState } from 'react';
import { SearchParams, SearchResponse, searchVideos } from '../../adapter/searchVideo-adapter';


interface SearchBarProps {
    newKeywords?: string,
    className?: string,
    onSearch: (searchResponse: SearchResponse) => void,
}

const SearchBar: React.FC<SearchBarProps> = ({ newKeywords, className, onSearch }) => {
    const [keywords, setKeywords] = useState(newKeywords || '');
    const [debouncedInpout, setDebouncedInpout] = useState('');

    const delay = 1100;
    let timerId: NodeJS.Timeout = setTimeout(() => {}, delay);;

    function debounce(callback: () => void, timeout: number) {
        clearTimeout(timerId);
        timerId = setTimeout(() => callback(), timeout);
    }

    useEffect(() => {
        console.log('SearchBar newKeywords', newKeywords);
        if (newKeywords && newKeywords !== '' && newKeywords !== keywords) {
            setKeywords(newKeywords);
            console.log('SearchBar setDebouncedInpout 1', newKeywords);
            setDebouncedInpout(newKeywords);
            return
        }
        if (debouncedInpout !== '') {
            console.log('SearchBar setDebouncedInpout 2', localStorage.getItem('last-search') || '');
            setKeywords(debouncedInpout);
            setDebouncedInpout(debouncedInpout)
            return
        }
        if (keywords === '') {
            console.log('SearchBar setKeywords 2', localStorage.getItem('last-search') || '');
            setKeywords(localStorage.getItem('last-search') || '');
            setDebouncedInpout(localStorage.getItem('last-search') || '')
            return
        }
    }, [newKeywords]);

    useEffect(() => {
        console.log('SearchBar keywords', keywords);
        if (keywords !== '') handleSearch()
    }, [keywords]);

    // useEffect(() => {
    //     if (debouncedInpout !== '') setKeywords(keywords)
    // }, [debouncedInpout]);

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

        console.log('SearchBar handleSearch with keywords', keywords);
        localStorage.setItem('last-search', keywords);
    };

    return (
        <div className={`${className} pr-3`}>
            <input
                className='w-full md:w-2/5'
                type="text"
                value={debouncedInpout}
                onChange={handleInputChange}
                placeholder="Search videos by title"
                onKeyUp={handleKeyup}
            />
            {/* <button className='' onClick={handleSearch}>Search</button> */}
        </div>
    );
};

export default SearchBar;
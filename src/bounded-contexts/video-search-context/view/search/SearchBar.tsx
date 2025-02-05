import React, { useEffect, useState } from 'react';
import { useSearchVideos } from '../../hooks/VideoSearchProvider';
import { useSearchHistory } from '../../hooks/SearchHistoryProvider';


interface SearchBarProps {
    newKeywords?: string,
    className?: string,
}

const SearchBar: React.FC<SearchBarProps> = ({ newKeywords, className }) => {
    const [keywords, setKeywords] = useState(newKeywords || '');
    const [debouncedInpout, setDebouncedInpout] = useState('');
    const { search } = useSearchVideos();
    const useSearchHist = useSearchHistory();

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
        search(keywords)

        console.log('SearchBar handleSearch with keywords', keywords);
        localStorage.setItem('last-search', keywords);
        useSearchHist.addOrUpdate({uid: crypto.randomUUID().toString(), keywords: keywords});
    };

    return (
        <div className={`${className} pr-3`}>
            <input
                className='w-80 md:w-2/5'
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
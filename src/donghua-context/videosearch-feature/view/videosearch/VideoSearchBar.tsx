import React, { useEffect, useState } from 'react';
import { useFavorites, useFollowedAnimes, useFollowedVideoOwners, useLastViews, useVideoSearchHistory } from '@/donghua-context/user-preferences-feature';
import { useSearchVideos } from '../../hooks';
import { PreferencesType } from '../../domain';


interface VideoSearchBarProps {
    newKeywords?: string,
    className?: string,
}

export const VideoSearchBar: React.FC<VideoSearchBarProps> = ({ newKeywords, className }) => {
    const [keywords, setKeywords] = useState(newKeywords || '');
    const [debouncedInpout, setDebouncedInpout] = useState('');
    const [strictSearch, setStrictSearch] = useState(false);
    const { search } = useSearchVideos();
    const useSearchHistory = useVideoSearchHistory();
    const useFollowedAnime = useFollowedAnimes();
    const useLastView = useLastViews();
    const useFavorite = useFavorites();
    const useFollowedVideoOwner = useFollowedVideoOwners();

    const delay = 1100;
    let timerId: NodeJS.Timeout = setTimeout(() => {}, delay);;

    function debounce(callback: () => void, timeout: number) {
        clearTimeout(timerId);
        timerId = setTimeout(() => callback(), timeout);
    }

    useEffect(() => {
        // console.log('SearchBar newKeywords', newKeywords);
        if (newKeywords && newKeywords !== '' && newKeywords !== keywords) {
            setKeywords(newKeywords);
            // console.log('SearchBar setDebouncedInpout 1', newKeywords);
            setDebouncedInpout(newKeywords);
            return
        }
        if (debouncedInpout !== '') {
            // console.log('SearchBar setDebouncedInpout 2', localStorage.getItem('last-search') || '');
            setKeywords(debouncedInpout);
            setDebouncedInpout(debouncedInpout)
            return
        }
        if (keywords === '') {
            // console.log('SearchBar setKeywords 2', localStorage.getItem('last-search') || '');
            setKeywords(localStorage.getItem('last-search') || '');
            setDebouncedInpout(localStorage.getItem('last-search') || '')
            return
        }
    }, [newKeywords]);

    useEffect(() => {
        // console.log('SearchBar keywords', keywords);
        if (keywords !== '') handleVideoSearch()
    }, [keywords, strictSearch]);

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

    const handleStrictSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStrictSearch(event.target.checked)
    };

    const handleKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleVideoSearch();
        }
    };

    const handleVideoSearch = async () => {

        const prefs: PreferencesType = {
            strictSearch: strictSearch,
            followedAnimes: useFollowedAnime.items,
            followedOwners: useFollowedVideoOwner.items,
            lastViews: useLastView.items,
            favorites: useFavorite.items,
            lastSearches: useSearchHistory.items
        }

        search(keywords, prefs)

        // console.log('SearchBar handleSearch with keywords', keywords);
        localStorage.setItem('last-search', keywords);
        useSearchHistory.addOrUpdate({uid: crypto.randomUUID().toString(), keywords: keywords});
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
            <label className='px-2 w-12'>strict search</label>
            <input className='px-2 w-4'
                type="checkbox"
                checked={strictSearch}
                onChange={handleStrictSearchChange} />
            {/* <button className='' onClick={handleSearch}>Search</button> */}
        </div>
    );
};

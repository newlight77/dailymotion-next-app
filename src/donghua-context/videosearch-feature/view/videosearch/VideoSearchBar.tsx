import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFollowedAnimes, useFollowedVideoOwners, useLastViews, useVideoSearchHistory } from '@/donghua-context/user-preferences-feature';
import { useSearchVideos } from '../../hooks';
import { PreferencesType } from '../../domain';


interface VideoSearchBarProps {
    newKeywords?: string,
    className?: string,
}

export const VideoSearchBar: React.FC<VideoSearchBarProps> = ({ newKeywords, className }) => {
    const [keywords, setKeywords] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [strictSearch, setStrictSearch] = useState(false);
    const { search } = useSearchVideos();
    const useSearchHistory = useVideoSearchHistory();
    const useFollowedAnime = useFollowedAnimes();
    const useLastView = useLastViews();
    const useFollowedVideoOwner = useFollowedVideoOwners();

    const delay = 1100;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const initializedRef = useRef(false);
    const followedAnimesRef = useRef(useFollowedAnime.items);
    const followedOwnersRef = useRef(useFollowedVideoOwner.items);
    const lastViewsRef = useRef(useLastView.items);
    const lastSearchesRef = useRef(useSearchHistory.items);
    const addOrUpdateHistoryRef = useRef(useSearchHistory.addOrUpdate);

    const debounce = useCallback((callback: () => void, timeout: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => callback(), timeout);
    }, []);

    useEffect(() => {
        if (newKeywords && newKeywords.trim() !== '') {
            setInputValue(newKeywords);
            setKeywords(newKeywords);
            return;
        }

        if (initializedRef.current) return;
        initializedRef.current = true;
        const last = typeof window !== 'undefined' ? (localStorage.getItem('last-search') || '') : '';
        if (last !== '') {
            setInputValue(last);
            setKeywords(last);
        }
    }, [newKeywords]);

    useEffect(() => {
        followedAnimesRef.current = useFollowedAnime.items;
    }, [useFollowedAnime.items]);

    useEffect(() => {
        followedOwnersRef.current = useFollowedVideoOwner.items;
    }, [useFollowedVideoOwner.items]);

    useEffect(() => {
        lastViewsRef.current = useLastView.items;
    }, [useLastView.items]);

    useEffect(() => {
        lastSearchesRef.current = useSearchHistory.items;
    }, [useSearchHistory.items]);

    useEffect(() => {
        addOrUpdateHistoryRef.current = useSearchHistory.addOrUpdate;
    }, [useSearchHistory.addOrUpdate]);

    const handleVideoSearch = useCallback(async () => {

        const prefs: PreferencesType = {
            strictSearch: strictSearch,
            followedAnimes: followedAnimesRef.current,
            followedOwners: followedOwnersRef.current,
            lastViews: lastViewsRef.current,
            lastSearches: lastSearchesRef.current
        }

        search(keywords, prefs)

        // console.log('SearchBar handleSearch with keywords', keywords);
        localStorage.setItem('last-search', keywords);
        addOrUpdateHistoryRef.current({uid: crypto.randomUUID().toString(), keywords: keywords});
    }, [keywords, strictSearch, search]);

    useEffect(() => {
        // console.log('SearchBar keywords', keywords);
        if (keywords !== '') handleVideoSearch()
    }, [keywords, strictSearch, handleVideoSearch]);

    // useEffect(() => {
    //     if (debouncedInpout !== '') setKeywords(keywords)
    // }, [debouncedInpout]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setInputValue(next);
        debounce(() => {
            setKeywords(next);
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



    return (
        <div className={`${className} pr-3`}>
            <input
                className='w-80 md:w-2/5'
                type="text"
                value={inputValue}
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

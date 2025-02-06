"use client"
import React, { useEffect, useState } from 'react';

import SearchBar from './SearchBar';
import VideoList from './VideoList';

type Props = {
    keywords?: string,
    className?: string
}

const Search: React.FC<Props> = ({keywords, className}) => {
    const [newKeywords, setNewKeywords] = useState<string>();

    useEffect(() => {
        if (keywords) setNewKeywords(keywords);
    }, [keywords]);

    return (
        <div className={className}>
                <SearchBar
                    className='search-bar p-1'
                    newKeywords={newKeywords}/>
                <VideoList
                    className='video-list p-1' />
        </div>
    );
};

export default Search;
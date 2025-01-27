"use client"
import React, { useEffect, useState } from 'react';

import SearchBar from './SearchBar';
import VideoList from './VideoList';
import { SearchResponse } from '../../adapter/searchVideo-adapter';
import { useLastViews } from '../../hooks/LastViewsProvider';
import { useFollowings } from '../../hooks/FollowingsProvider';
import { useSearchHistory } from '../../hooks/SearchHistoryProvider';
import { MetaVideoType, VideoType } from '../../domain/anime';

type Props = {
    keywords?: string,
    className?: string
}

const Search: React.FC<Props> = ({keywords, className}) => {
    const [searchResults, setSearchResults] = useState<MetaVideoType[]>([]);
    const [newKeywords, setNewKeywords] = useState<string>();
    const useFollowing = useFollowings();
    const useLastView = useLastViews();
    const useSearchHist = useSearchHistory();

    useEffect(() => {
        if (keywords) setNewKeywords(keywords);
    }, [keywords]);

    const handleSearch = (searchResponse: SearchResponse) => {
        const { results } = searchResponse;
        setSearchResults(results?.list || []);
        useSearchHist.addOrUpdate({uid: crypto.randomUUID().toString(), keywords: searchResponse.search});
    };

    const handleAddLastView = (video: VideoType) => {
        useLastView.addOrUpdate({uid: crypto.randomUUID().toString(), videoId: video.videoId, title: video.title, episode: video.episode, owner: video.owner, link: video.link});
    };

    const handleFollowOwner = (video: VideoType) => {
        useFollowing.addOrUpdate({uid: crypto.randomUUID().toString(), owner: video.owner, order: 0});
    };

    return (
        <div className={className}>
                <SearchBar
                    className='search-bar p-1'
                    onSearch={handleSearch}
                    newKeywords={newKeywords}/>
                <VideoList
                    className='video-list p-1'
                    videos={searchResults}
                    onAddLastView={handleAddLastView}
                    onFollowOwner={handleFollowOwner}/>
        </div>
    );
};

export default Search;
"use client"
import React, { useEffect, useState } from 'react';

import SearchBar from './SearchBar';
import VideoList from './VideoList';
import { useLastViews } from '../../hooks/LastViewsProvider';
import { useFollowings } from '../../hooks/FollowingsProvider';
import { VideoType } from '../../domain/anime';

type Props = {
    keywords?: string,
    className?: string
}

const Search: React.FC<Props> = ({keywords, className}) => {
    const [newKeywords, setNewKeywords] = useState<string>();
    const useFollowing = useFollowings();
    const useLastView = useLastViews();

    useEffect(() => {
        if (keywords) setNewKeywords(keywords);
    }, [keywords]);

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
                    newKeywords={newKeywords}/>
                <VideoList
                    className='video-list p-1'
                    onAddLastView={handleAddLastView}
                    onFollowOwner={handleFollowOwner}/>
        </div>
    );
};

export default Search;
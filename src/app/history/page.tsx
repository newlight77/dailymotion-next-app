"use client"
import { FavoriteType } from '@/components/objects/favorites/Favorites';
import { Following } from '@/components/objects/Followings';
import SearchHistory from '@/components/objects/SearchHsitory';
import ViewHistory, { LastView } from '@/components/objects/ViewHistory';
import React, { useState } from 'react';


const HistoryPage: React.FC = () => {
    const [newToFavortie, setNewToFavorite] = useState<FavoriteType>();
   const [newKeywords, setNewKeywords] = useState<string>('');
    const [newToHsitory, setNewToHistory] = useState<string>('');
    const [newToLastview, setNewToLastView] = useState<LastView>();
    const [newToFollowingFollowing, setNewToFollowingUser] = useState<Following>();

    const handleSelectSearchHistory = (selectedKeywords: string) => {
        setNewKeywords(selectedKeywords);
    };

    const handleSelectRecentView = (selectedLastView: LastView) => {
        setNewKeywords(`${selectedLastView.title} ${selectedLastView.episode ? selectedLastView.episode : ''}`);
    };

    const handleAddSearchToFavorite = (keywords: string) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: keywords, order: 0});
    };

    const handleAddRecentViewToFavorite = (lastview: LastView) => {
        setNewToFavorite({uid: crypto.randomUUID().toString(), title: lastview.title, lastEpisode: lastview.episode, order: 0});
    };

    const handleAddViewToFollowingUser = (following: Following) => {
        setNewToFollowingUser(following);
    };

    return (
        <div className='container w-full'>
            <h2 className='title text-4xl p-1 md:p-4 capitalize'>my recent searches and views</h2>
            <div className='history md:flex flex-wrap'>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <SearchHistory onSelected={handleSelectSearchHistory} onAddToFavorite={handleAddSearchToFavorite} newKeywords={newToHsitory} />
                </div>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <ViewHistory onSelected={handleSelectRecentView} onAddToFavorite={handleAddRecentViewToFavorite} onFollowOwner={handleAddViewToFollowingUser} newLastView={newToLastview} />
                </div>
            </div>

        </div>
    );
};

export default HistoryPage;

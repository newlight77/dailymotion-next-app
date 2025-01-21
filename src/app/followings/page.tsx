"use client"
import Followings, { Following } from '@/components/objects/Followings';
import React, { useState } from 'react';


const FollowingsPage: React.FC = () => {
    const [newKeywords, setNewKeywords] = useState<string>('');
    const [newToFollowingUser, setNewToFollowingUser] = useState<Following>();

    const handleFollowUser = (followingUser: Following) => {
        setNewToFollowingUser(followingUser);
    };

    const handleSelectFollowing = (selectedFollowing: Following) => {
        setNewKeywords(selectedFollowing.owner);
    };

    return (
        <div className='container w-full'>
            <h2 className='title text-4xl p-1 md:p-4 capitalize'>my followings</h2>

            <div className='history md:flex flex-wrap'>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <Followings onSelected={handleSelectFollowing} newFollowing={newToFollowingUser} />
                </div>
            </div>
        </div>
    );
};

export default FollowingsPage;

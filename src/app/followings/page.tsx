"use client"
import React from 'react';
import Followings from '@/bounded-contexts/video-search-context/view/followings/Followings';
import FollowedAnimes from '@/bounded-contexts/video-search-context/view/followings/FollowedAnimes';


const FollowingsPage: React.FC = () => {

    return (
        <div className='w-full'>
            {/* <h2 className='title text-3xl p-1 md:p-4 capitalize'>my recent searches and views</h2> */}
            <div className='history md:grid grid-cols-2 gap-4 sm:max-w-screen-sm md:max-w-screen-xl'>
                <div className="pt-2">
                    <h3 className='title text-2xl p-1 md:p-4 capitalize'>followed animes</h3>
                    <FollowedAnimes />
                </div>
                <div className="pt-2">
                    <h3 className='title text-2xl p-1 md:p-4 capitalize'>followed video publishers</h3>
                    <Followings />
                </div>
            </div>
        </div>
    );
};

export default FollowingsPage;

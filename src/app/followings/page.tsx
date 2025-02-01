"use client"
import Followings from '../../bounded-contexts/video-search-context/view/followings/Followings';
import React from 'react';


const FollowingsPage: React.FC = () => {

    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>my followings</h2>

            <div className='pb-4 pt-4 md:absolute md:z-100 md:p-2 md:m-1 sm:max-w-screen-sm md:max-w-screen-xl'>
                <Followings />
            </div>
        </div>
    );
};

export default FollowingsPage;

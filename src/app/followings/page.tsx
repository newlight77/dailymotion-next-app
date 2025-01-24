"use client"
import Followings from '../../search-context/search-provider/components/followings/Followings';
import React from 'react';


const FollowingsPage: React.FC = () => {

    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>my followings</h2>

            <div className='pb-4 pt-4 md:absolute md:z-100 md:p-2 md:m-1 w-2/4'>
                <Followings />
            </div>
        </div>
    );
};

export default FollowingsPage;

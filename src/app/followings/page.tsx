"use client"
import Followings from '../../search-context/search-provider/components/followings/Followings';
import React from 'react';


const FollowingsPage: React.FC = () => {

    return (
        <div className='container w-full'>
            <h2 className='title text-4xl p-1 md:p-4 capitalize'>my followings</h2>

            <div className='history md:flex flex-wrap'>
                <div className="basis-1/8 pt-2 md:w-1/4 sm:w-64">
                    <h3 className='title text-4xl p-1 md:p-4 capitalize'>followings</h3>
                    <Followings />
                </div>
            </div>
        </div>
    );
};

export default FollowingsPage;

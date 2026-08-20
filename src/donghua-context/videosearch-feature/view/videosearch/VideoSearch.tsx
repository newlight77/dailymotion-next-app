"use client"
import React from 'react';
import { VideoSearchBar } from './VideoSearchBar';
import { VideoList } from './VideoList';


type Props = {
    keywords?: string,
    className?: string
}

export const VideoSearch: React.FC<Props> = ({keywords, className}) => {
    return (
        <div className={className}>
                <VideoSearchBar
                    className='search-bar p-1'
                    newKeywords={keywords}/>
                <VideoList
                    className='video-list p-1' />
        </div>
    );
};

import React, { useState } from 'react';
import Link from 'next/link'
import { MetaVideo } from '../../service/searchVideo';
import Image from 'next/image';
import { LastView } from './ViewHistory';
import { Following } from './Followings';
import VideoCard from '../molecules/VideoCard';


interface VideoListProps {
    videos: MetaVideo[];
    onSelected: (lastView: LastView) => void;
    onFollowOwner: (following: Following) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onSelected, onFollowOwner }) => {

    const [filterKeywords, setFilterKeywords] = useState('');
    const [exclusions, setExclusions] = useState('');

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    const onExclusionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExclusions(event.target.value);
    };

    return (
        <div className="pt-4 md:p-2">

            {
                videos.length !== 0 ?
                <div className="flex pb-4 text-primary">
                    <input
                        type="text"
                        value={filterKeywords}
                        onChange={onFilterInputChange}
                        placeholder="filter on title"
                    />
                    <input
                        type="text text-primary"
                        value={exclusions}
                        onChange={onExclusionsInputChange}
                        placeholder="exclusions on title"
                    />
                </div>
                :
                <></>
            }

            <div className="md:flex flex-wrap gap-4">
                {videos
                    .filter(v => filterKeywords !== '' ? v.title.toLowerCase().includes(filterKeywords.toLowerCase()) || v.description.toLowerCase().includes(filterKeywords.toLowerCase()) || v.ownerUsername.includes(filterKeywords.toLowerCase()): true)
                    .filter(v => exclusions !== '' ? !v.title.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .filter(v => exclusions !== '' ? !v.description.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .filter(v => exclusions !== '' ? !v.ownerUsername.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .sort((a: MetaVideo, b: MetaVideo)=> b.updated_time - a.updated_time)
                    .map(video => (
                        <VideoCard video={video} onAddLastView={onSelected} onFollowOwner={onFollowOwner}></VideoCard>
                    ))
                }
            </div>
        </div>
    );
};

export default VideoList;
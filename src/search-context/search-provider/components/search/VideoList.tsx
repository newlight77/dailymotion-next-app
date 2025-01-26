import React, { useState } from 'react';
import VideoCard from './VideoCard';
import { MetaVideo, VideoType } from '../../domain/anime';


interface VideoListProps {
    videos: MetaVideo[],
    onAddLastView: (lastView: VideoType) => void,
    onFollowOwner: (following: VideoType) => void,
    className?: string
}

const VideoList: React.FC<VideoListProps> = ({ videos, onAddLastView, onFollowOwner, className }) => {

    const [filterKeywords, setFilterKeywords] = useState('');
    const [exclusions, setExclusions] = useState('');

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    const onExclusionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExclusions(event.target.value);
    };

    return (
        <div className={className}>

            {
                videos.length > 0 ?
                <div className="pt-4 pb-4 text-primary">
                    <input
                        type="text"
                        value={filterKeywords}
                        onChange={onFilterInputChange}
                        placeholder="filter on title, description or owner"
                    />
                    <input
                        type="text"
                        value={exclusions}
                        onChange={onExclusionsInputChange}
                        placeholder="exclusions on title, description or owner"
                    />
                </div>
                :
                <></>
            }

            <div className="md:flex flex-wrap gap-4">
                { videos
                    .filter(v => filterKeywords !== '' ? v.title.toLowerCase().includes(filterKeywords.toLowerCase()) || v.description.toLowerCase().includes(filterKeywords.toLowerCase()) || v.ownerUsername.includes(filterKeywords.toLowerCase()): true)
                    .filter(v => exclusions !== '' ? !v.title.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .filter(v => exclusions !== '' ? !v.description.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .filter(v => exclusions !== '' ? !v.ownerUsername.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .sort((a: MetaVideo, b: MetaVideo)=> b.updated_time - a.updated_time)
                    .map(video => (
                        <VideoCard
                            className="pt-4 pb-4 grow md:max-w-screen-md"
                            key={video.id}
                            video={video}
                            onAddLastView={onAddLastView}
                            onFollowOwner={onFollowOwner}></VideoCard>
                    ))
                }
            </div>
        </div>
    );
};

export default VideoList;
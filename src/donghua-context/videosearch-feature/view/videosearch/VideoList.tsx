import React, { useState } from 'react';
import { useSearchVideos } from '../../hooks';
import { MetaVideoType } from '../../domain';
import { VideoCard } from './VideoCard';


interface VideoListProps {
    className?: string
}

export const VideoList: React.FC<VideoListProps> = ({ className }) => {

    const [filterKeywords, setFilterKeywords] = useState('');
    const [exclusions, setExclusions] = useState('');
    const useSearchVideo = useSearchVideos();

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    const onExclusionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExclusions(event.target.value);
    };

    return (
        <div className={className}>

            {
                (useSearchVideo.searchResults || []).length > 0 ?
                <div className="pt-4 pb-4 text-primary">
                    <input
                        className='w-80'
                        type="text"
                        value={filterKeywords}
                        onChange={onFilterInputChange}
                        placeholder="filter on title, description or owner"
                    />
                    <input
                        className='w-80'
                        type="text"
                        value={exclusions}
                        onChange={onExclusionsInputChange}
                        placeholder="exclusions on title, description or owner"
                    />
                </div>
                :
                <></>
            }

            <div className="md:flex flex-wrap">
                {
                    (useSearchVideo.searchResults || []).filter(v => matchingTitleOrDescriptionOrOwner(v))
                    .filter(v => exclusions !== '' ? !v.title.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .filter(v => exclusions !== '' ? !v.description.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    .filter(v => exclusions !== '' ? !v.ownerUsername.toLowerCase().includes(exclusions.toLowerCase()) : true)
                    // .sort((a: MetaVideoType, b: MetaVideoType)=> b.updated_time - a.updated_time)
                    .map(video => (
                        <VideoCard
                            className="video-card pt-4 pb-4 xs:w-screen sm:w-screen lg:w-1/2 2xl:w-1/3 4xl:w-1/4 h-auto"
                            key={video.id}
                            video={video} />
                    ))
                }
            </div>
        </div>
    );

    function matchingTitleOrDescriptionOrOwner(v: MetaVideoType): unknown {
        if (filterKeywords === '') return true;
        return v.title.toLowerCase().includes(filterKeywords.toLowerCase())
            || v.description.toLowerCase().includes(filterKeywords.toLowerCase())
            || v.ownerUsername.includes(filterKeywords.toLowerCase());
    }
};

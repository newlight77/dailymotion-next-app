import React, { useState } from 'react';
import Link from 'next/link'
import { MetaVideo } from '../service/searchVideo';
import Image from 'next/image';
import { LastView } from './ViewHistory';
import { Following } from './Followings';


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

    const selectVideo = (video: MetaVideo) => {
        onSelected({id: video.id, title: video.title, episode: '', owner: video.ownerUsername, link: `https://www.dailymotion.com/video/${video.id}`});
    }

    const followOwner = (following: Following) => {
        onFollowOwner({uid: following.uid, owner: following.owner, order: 0});
    }

    const dateTimeFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }

    const displayDate = (time: number) => {
        return new Date(time * 1000).toLocaleDateString('en-US', dateTimeFormat);
        // return new Intl.DateTimeFormat('en-US', format).format(time * 1000);
    }

    const displayDuration = (time: number) => {
        const date = new Date(time * 1000)
        return `${date.getMinutes()}:${date.getSeconds()}`;
    }

    return (
        <div className="pt-4 md:p-4">

            {
                videos.length !== 0 ?
                <div className="flex pb-4">
                    <input
                        type="text"
                        value={filterKeywords}
                        onChange={onFilterInputChange}
                        placeholder="filter on title"
                    />
                    <input
                        type="text"
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
                    <div key={video.id} className="basis-1/4 pt-4 pb-4 w-screen grow md:hover:border border-gold">
                        <Link className='view'
                                href={`/video/${video.id}`}
                                target="_blank"
                                onClick={() => selectVideo(video)}>
                            <Image className='video'
                                src={video.thumbnail_480_url}
                                alt={video.title}
                                width={480}
                                height={480} />
                        </Link>
                        <Link className='videoLink' href={`https://www.dailymotion.com/video/${video.id}`}>
                            <div className=''>view on dailymotion</div>
                        </Link>
                        <div className=''>
                            <div className='title font-extrabold text-xl text-wrap'>{video.title}</div>
                            <div className='description text-sm text-wrap'>{video.description}</div>
                            <Link className='followinglink'
                                href={''}
                                onClick={() => followOwner({uid: video.id, owner: video.ownerUsername, order: 0})}>
                                <div className=''>follow <span className='p-1 border border-primaryVariant bg-secondaryVariant'>{`${video.ownerUsername}`}</span></div>
                            </Link>
                            <div className='flex flex-wrap items-center'>
                                <div className='basis-1/2'>duration: {displayDuration(video.duration)}</div>
                                <div className='basis-1/2'>updated time: {displayDate(video.updated_time)}</div>
                                <div className='basis-1/2'>language: {video.language}</div>
                                <div className='basis-1/2'>country: {video.country}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoList;
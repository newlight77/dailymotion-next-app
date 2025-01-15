import React, { useState } from 'react';
import Link from 'next/link'
import { MetaVideo } from '../service/searchVideo';
import Image from 'next/image';
import { LastView } from './ViewHistory';
import { Following } from './Followings';


interface VideoListProps {
    videos: MetaVideo[];
    onSelected: (lastView: LastView) => void;
    onFollowUser: (following: Following) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onSelected, onFollowUser }) => {

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
        onFollowUser({uid: following.uid, owner: following.owner, link: `https://www.dailymotion.com/${following.owner}`});
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
                    .filter(v => filterKeywords !== '' ? v.title.includes(filterKeywords) || v.description.includes(filterKeywords) || v.ownerUsername.includes(filterKeywords): true)
                    .filter(v => exclusions !== '' ? !v.title.includes(exclusions) : true)
                    .filter(v => exclusions !== '' ? !v.description.includes(exclusions) : true)
                    .filter(v => exclusions !== '' ? !v.ownerUsername.includes(exclusions) : true)
                    .sort((a: MetaVideo, b: MetaVideo)=> b.updated_time - a.updated_time)
                    .map(video => (
                    <div key={video.id} className="basis-1/4 pt-4 pb-4 w-screen grow md:hover:border border-gold">
                        <Link className='videolink'
                                href={`https://www.dailymotion.com/video/${video.id}`}
                                target="_blank"
                                onClick={() => selectVideo(video)}>
                            <Image className='video'
                                src={video.thumbnail_480_url}
                                alt={video.title}
                                width={480}
                                height={480} />
                        </Link>
                        <div className=''>
                            <div className='title font-extrabold text-xl text-wrap'>{video.title}</div>
                            <div className='description text-sm text-wrap'>{video.description}</div>
                            <div className=''>duration: {displayDuration(video.duration)}</div>
                            <div className=''>updated time: {displayDate(video.updated_time)}</div>
                            <div className='flex flex-wrap items-center'>
                                <Link className='followinglink basis-1/2'
                                    href={''}
                                    onClick={() => followOwner({uid: video.id, owner: video.ownerUsername, link: ''})}>
                                    <div className=''>follow <span className='p-1 border border-primaryVariant bg-secondaryVariant'>{`${video.ownerUsername}`}</span></div>
                                </Link>
                                <div className='basis-1/2'>language: {video.language}</div>
                                {/* <div>following slug: {video.followingSlug}</div> */}
                                {/* <div>following description: {video.followingDescription}</div> */}
                                <div className='basis-1/2'>country: {video.country}</div>
                                <div className='basis-1/2'>owner country: {video.ownerCountry}</div>
                                {/* <div>owner language: {video.ownerLanguage}</div> */}
                                <div className='basis-1/2'>owner username: {video.ownerUsername}</div>
                                {/* <div className='basis-1/2'>owner url: {video.ownerUrl}</div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoList;
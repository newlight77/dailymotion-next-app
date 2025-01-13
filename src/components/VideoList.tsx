import React, { useState } from 'react';
import Link from 'next/link'
import { MetaVideo } from '../service/searchVideo';
import Image from 'next/image';
import { LastView } from './ViewHistory';
import { Channel } from './FollowingChannels';


interface VideoListProps {
    videos: MetaVideo[];
    onSelected: (lastView: LastView) => void;
    onSelectedChannel: (channel: Channel) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onSelected, onSelectedChannel }) => {

    const [filterKeywords, setFilterKeywords] = useState('');
    const [exclusions, setExclusions] = useState('');

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    const onExclusionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExclusions(event.target.value);
    };

    const selectVideo = (video: MetaVideo) => {
        onSelected({id: video.id, title: video.title, episode: '', channel: video.channel, link: `https://www.dailymotion.com/video/${video.id}`});
    }

    const selectChannel = (channel: Channel) => {
        onSelectedChannel({uid: channel.uid, name: channel.name, slug: '', link: `https://www.dailymotion.com/channels/${channel.uid}`});
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
                    .filter(v => filterKeywords !== '' ? v.title.includes(filterKeywords) : true)
                    .filter(v => filterKeywords !== '' ? v.description.includes(filterKeywords) : true)
                    .filter(v => filterKeywords !== '' ? v.channel.includes(filterKeywords) : true)
                    .filter(v => exclusions !== '' ? !v.title.includes(exclusions) : true)
                    .filter(v => exclusions !== '' ? !v.description.includes(exclusions) : true)
                    .filter(v => exclusions !== '' ? !v.channel.includes(exclusions) : true)
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
                                <Link className='channellink basis-1/2'
                                    href={`https://www.dailymotion.com/video/${video.id}`}
                                    target="_blank"
                                    onClick={() => selectChannel({uid: video.channelId, name: video.channelName, slug: video.channelSlug, link: ''})}>
                                    <div className=''>channel: {video.channel}</div>
                                </Link>
                                <div className='basis-1/2'>language: {video.language}</div>
                                <div>channel name: {video.channelName}</div>
                                <div>channel id: {video.channelId}</div>
                                {/* <div>channel slug: {video.channelSlug}</div> */}
                                {/* <div>channel description: {video.channelDescription}</div> */}
                                <div className='basis-1/2'>country: {video.country}</div>
                                <div className='basis-1/2'>owner country: {video.ownerCountry}</div>
                                {/* <div>owner language: {video.ownerLanguage}</div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoList;
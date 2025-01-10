import React, { useState } from 'react';
import Link from 'next/link'
import { MetaVideo } from '../service/searchVideo';
import Image from 'next/image';

interface VideoListProps {
    videos: MetaVideo[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {

    const [filterKeywords, setFilterKeywords] = useState('');
    const [exclusions, setExclusions] = useState('');

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    const onExclusionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExclusions(event.target.value);
    };

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
        <div className="">
            <div>
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
            <div className="flex flex-wrap">
                {videos
                    .filter(v => filterKeywords !== '' ? v.title.includes(filterKeywords) : true)
                    .filter(v => exclusions !== '' ? !v.title.includes(exclusions) : true)
                    .sort((a: any, b: any)=> b.updated_time - a.updated_time)
                    .map(video => (
                    <div key={video.id} className="basis-1/3 p-3 grow hover:border border-gold">
                        <Link href={`https://www.dailymotion.com/video/${video.id}`}>
                            <Image src={video.thumbnail_480_url} alt={video.title} width={640} height={640} />
                            <h5>title: {video.title}</h5>
                        </Link>
                        <h5>description: {video.description}</h5>
                        <h5>duration: {displayDuration(video.duration)}</h5>
                        <h5>channel: {video.channel}</h5>
                        <h5>language: {video.language}</h5>
                        {/* <h5>channel name: {video.channelName}</h5> */}
                        {/* <h5>channel id: {video.channelId}</h5> */}
                        {/* <h5>channel slug: {video.channelSlug}</h5> */}
                        {/* <h5>channel description: {video.channelDescription}</h5> */}
                        <h5>country: {video.country}</h5>
                        <h5>owner country: {video.ownerCountry}</h5>
                        {/* <h5>owner language: {video.ownerLanguage}</h5> */}
                        <h5>updated time: {displayDate(video.updated_time)}</h5>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoList;
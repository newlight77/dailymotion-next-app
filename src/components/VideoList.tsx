import React, { useState } from 'react';
import Link from 'next/link'
import { MetaVideo } from '../service/searchVideo';
import Image from 'next/image';
import { LastView } from './ViewHistory';

interface VideoListProps {
    videos: MetaVideo[];
    onSelected: (lastView: LastView) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onSelected }) => {

    const [filterKeywords, setFilterKeywords] = useState('');
    const [exclusions, setExclusions] = useState('');

    const onFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterKeywords(event.target.value);
    };

    const onExclusionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExclusions(event.target.value);
    };

    const selectVideo = (video: MetaVideo) => {
        onSelected({id: video.id, title: video.title, episode: '', link: `https://www.dailymotion.com/video/${video.id}`});
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
        <div className="p-4">

            {
                videos.length !== 0 ?
                <div className="p-4">
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

            <div className="flex flex-wrap">
                {videos
                    .filter(v => filterKeywords !== '' ? v.title.includes(filterKeywords) : true)
                    .filter(v => exclusions !== '' ? !v.title.includes(exclusions) : true)
                    .filter(v => exclusions !== '' ? !v.description.includes(exclusions) : true)
                    .sort((a: MetaVideo, b: MetaVideo)=> b.updated_time - a.updated_time)
                    .map(video => (
                    <div key={video.id} className="basis-1/3 p-2 m-2 grow hover:border border-gold">
                        <Link href={`https://www.dailymotion.com/video/${video.id}`} target="_blank" onClick={() => selectVideo(video)}>
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
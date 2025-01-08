import React from 'react';
// import { Link } from 'react-router';
import Link from 'next/link'
import { MetaVideo } from '../service/searchVideo';
import Image from 'next/image';

interface VideoListProps {
    videos: MetaVideo[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {

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
        <div className="flex flex-wrap">
            {videos
                .map(video => (
                <div key={video.id} className="basis-1/3 p-3">
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
    );
};

export default VideoList;
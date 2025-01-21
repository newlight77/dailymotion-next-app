import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { MetaVideo } from '@/service/searchVideo';
import { LastView } from '../objects/ViewHistory';
import { Following } from '../objects/Followings';



interface VideoCardProps {
    video: MetaVideo;
    onAddLastView: (lastView: LastView) => void;
    onFollowOwner: (following: Following) => void;
}

const SearchHistory: React.FC<VideoCardProps> = ({video, onAddLastView, onFollowOwner}) => {

    const addLastView = (video: MetaVideo) => {
        onAddLastView({id: video.id, title: video.title, episode: '', owner: video.ownerUsername, link: `https://www.dailymotion.com/video/${video.id}`});
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
        <div key={video.id} className="basis-1/4 pt-4 pb-4 w-screen grow md:hover:border border-gold">
            <Link className='view'
                    href={`/video/${video.id}`}
                    target="_blank"
                    onClick={() => addLastView(video)}>
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
                <Link className='titlelink'
                    href={`/video/${video.id}`}
                    target="_blank"
                    onClick={() => addLastView(video)}>
                    <div className='title font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{video.title}</div>
                </Link>
                <div className='description text-sm text-wrap'>{video.description}</div>
                <Link className='followinglink'
                    href={''}
                    onClick={() => followOwner({uid: video.id, owner: video.ownerUsername, order: 0})}>
                    <div className=''>follow <span className='p-1 text-tertiary'>{`${video.ownerUsername}`}</span></div>
                </Link>
                <div className='flex flex-wrap items-center'>
                    <div className='basis-1/2'>duration: {displayDuration(video.duration)}</div>
                    <div className='basis-1/2'>updated time: {displayDate(video.updated_time)}</div>
                    <div className='basis-1/2'>language: {video.language}</div>
                    <div className='basis-1/2'>country: {video.country}</div>
                </div>
            </div>
        </div>
    );
};

export default SearchHistory;
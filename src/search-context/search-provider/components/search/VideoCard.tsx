import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaCirclePlay, FaUserPlus } from 'react-icons/fa6';
import { MetaVideo, VideoType } from '../../domain/anime';


interface VideoCardProps {
    video: MetaVideo,
    onAddLastView: (lastView: VideoType) => void,
    onFollowOwner: (following: VideoType) => void,
    className?: string
}

const SearchHistory: React.FC<VideoCardProps> = ({video, onAddLastView, onFollowOwner, className}) => {

    const handleAddLastView = (video: MetaVideo) => {
        const v = {
            videoId: video.id,
            title: video.title,
            episode: '',
            owner: video.ownerUsername,
            link: `https://www.dailymotion.com/video/${video.id}`
        }
        onAddLastView(v);
    }

    const handleFollowOwner = (video: MetaVideo) => {
        const v = {
            videoId: video.id,
            title: video.title,
            episode: '',
            owner: video.ownerUsername,
            link: `https://www.dailymotion.com/video/${video.id}`
        }
        onFollowOwner(v);
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
        <div className={`${className} m-2 md:hover:border border-gold`}>
            <Link className='view'
                    href={`/video/${video.id}`}
                    target="_blank"
                    onClick={() => handleAddLastView(video)}>
                <Image className='video h-96 '
                    src={video.thumbnail_480_url}
                    alt={video.title}
                    width={480}
                    height={480} />
            </Link>
            <Link className='titlelink'
                    href={`/video/${video.id}`}
                    target="_blank"
                    onClick={() => handleAddLastView(video)}>
                    <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{video.title}</div>
            </Link>
            <div className='content p-2'>
                <div className='grid grid-cols-2 pt-4 gap-2 items-center'>
                    <div className='ml-4'>duration: {displayDuration(video.duration)}</div>
                    <div className='ml-4'>updated time: {displayDate(video.updated_time)}</div>
                    <div className='ml-4'>language: {video.language}</div>
                    <div className='ml-4'>country: {video.country}</div>
                </div>
            </div>
            <div className='grid grid-cols-2 pt-5 items-center'>
                <Link className='videoLink ml-4 flex items-center gap-2' href={`https://www.dailymotion.com/video/${video.id}`}>
                    <FaCirclePlay size={20} className="hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                    <div className=''>on dailymotion</div>
                </Link>

                <Link className='followinglink ml-4 flex items-center gap-2'
                    href={''}
                    onClick={() => handleFollowOwner(video)}>
                    <FaUserPlus size={20} className="hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                    <span className='p-1 text-tertiary'>{`${video.ownerUsername}`}</span>
                </Link>
            </div>

            <div className='description text-sm text-wrap pt-1 h-10 m-2 hover:h-fit'>{video.description}</div>

        </div>
    );
};

export default SearchHistory;
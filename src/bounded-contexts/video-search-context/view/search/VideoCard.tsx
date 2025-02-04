import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaCirclePlay, FaThumbtack } from 'react-icons/fa6';
import { MetaVideoType, VideoType } from '../../domain/model/anime';
import { displayDate, displayDurationInHMS } from '@/shared/dateUtil';
import { useFollowings } from '../../hooks';


interface VideoCardProps {
    video: MetaVideoType,
    onAddLastView: (lastView: VideoType) => void,
    onFollowOwner: (following: VideoType) => void,
    className?: string
}

const SearchHistory: React.FC<VideoCardProps> = ({video, onAddLastView, onFollowOwner, className}) => {

    const followings = useFollowings();

    const handleAddLastView = (video: MetaVideoType) => {
        const v = {
            videoId: video.id,
            title: video.title,
            episode: 0,
            owner: video.ownerUsername,
            link: `https://www.dailymotion.com/video/${video.id}`
        }
        onAddLastView(v);
    }

    const handleFollowOwner = (video: MetaVideoType) => {
        const v = {
            videoId: video.id,
            title: video.title,
            episode: 0,
            owner: video.ownerUsername,
            link: `https://www.dailymotion.com/video/${video.id}`
        }
        onFollowOwner(v);
    }

    const isFollowed = (video: MetaVideoType): boolean => {
        const results = followings.items?.filter(f => f.owner === video.ownerUsername)
        return results?.length === 1
    }

    return (
        <div className={`${className} p-2 md:hover:border border-gold`}>

            <div className='relative'>
                <div className='grid grid-rows-2 pt-5 absolute translate-y-44 '>
                    <Link className='videoLink mb-4 flex gap-2 px-4' href={`https://www.dailymotion.com/video/${video.id}`}>
                        <FaCirclePlay size={36} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant border border-tertiaryVariant outline outline-tertiaryVariant"/>
                        <div className='bg-secondaryVariant rounded-md px-2 content-center border border-tertiaryVariant outline outline-tertiaryVariant'>on dailymotion</div>
                    </Link>
                    <Link className='followinglink mb-4 flex gap-2 px-4'
                        href={''}
                        onClick={() => handleFollowOwner(video)}>
                        <FaThumbtack size={36} className={`${isFollowed(video) ? 'text-tertiary' : ''} p-2 hover:border rounded-md border-tertiary bg-secondaryVariant border border-tertiaryVariant outline outline-tertiaryVariant`}/>
                        <span className='p-1 bg-secondaryVariant rounded-md px-2 content-center border border-tertiaryVariant outline outline-tertiaryVariant'>{`${video.ownerUsername}`}</span>
                    </Link>
                    <div className='px-2 py-1 ml-4 mb-4 gap-2 w-fit bg-secondaryVariant rounded-lg border border-tertiaryVariant outline outline-tertiaryVariant'>{displayDurationInHMS(video.duration)}</div>
                </div>
                <Link className='thumbnaillink' href={`/video/${video.id}`} target="_blank" onClick={() => handleAddLastView(video)}>
                    <Image className='video h-96 w-148' src={video.thumbnail_480_url} alt={video.title} width={480} height={480} />
                    <FaCirclePlay size={52} className="absolute inset-0 m-auto"/>
                </Link>
            </div>

            <Link className='titlelink'
                    href={`/video/${video.id}`}
                    target="_blank"
                    onClick={() => handleAddLastView(video)}>
                    <div className='title h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{video.title}</div>
            </Link>
            <div className='content p-2'>
                <div className='grid grid-cols-2 pt-4 gap-2'>
                    <div className='ml-4'>updated time: {displayDate(video.updated_time)}</div>
                    <div className='ml-4'>language: {video.language}</div>
                    <div className='ml-4'>country: {video.country}</div>
                </div>
            </div>
        </div>
    );
};

export default SearchHistory;
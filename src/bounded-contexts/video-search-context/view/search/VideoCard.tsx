import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { FaCirclePlay, FaThumbtack } from 'react-icons/fa6';
import { FollowedVideoOwnerType, LastViewType, MetaVideoType } from '../../domain/model/anime';
import { displayDate, displayDurationInHMS } from '@/shared/dateUtil';
import { useFollowedVideoOwners, useLastViews } from '../../hooks';


interface VideoCardProps {
    video: MetaVideoType,
    className?: string
}

const SearchHistory: React.FC<VideoCardProps> = ({video, className}) => {

    const useFollowedVideo = useFollowedVideoOwners();
    const useLastView = useLastViews();

    useEffect(() => {

    }, [useFollowedVideo.remove])

    const handleAddLastView = (video: MetaVideoType) => {
        const l: LastViewType = {
            uid: video.id,
            videoId: video.id,
            title: video.title,
            episode: 0,
            owner: video.ownerUsername,
            link: `https://www.dailymotion.com/video/${video.id}`

        }
        useLastView.addOrUpdate(l);
    }

    const handleFollowOwner = (video: MetaVideoType) => {
        if (isFollowed(video)) {
            useFollowedVideo.remove(video.id)
        } else {
            const f: FollowedVideoOwnerType = {
                uid: video.id,
                owner: video.ownerUsername,
                order: 0
            }
            useFollowedVideo.addOrUpdate(f)
        }
    }

    const isFollowed = (video: MetaVideoType): boolean => {
        const results = useFollowedVideo.items?.filter(f => f.owner === video.ownerUsername)
        return results?.length === 1
    }

    return (
        <div className={`${className} md:p-2 md:hover:border border-gold rounded-md`}>

            <div className='relative'>
                <div className='grid grid-rows-2 pt-5 absolute translate-y-8 '>
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
                </div>
                <Link className='thumbnaillink' href={`/video/${video.id}`} target="_blank" onClick={() => handleAddLastView(video)}>
                    <Image className='video sm:w-112 md:w-full md:h-96' src={video.thumbnail_480_url} alt={video.title} width={480} height={480} />
                    <FaCirclePlay size={52} className="absolute inset-0 m-auto"/>
                    <div className='absolute -translate-y-14 px-2 py-1 ml-4 mb-4 gap-2 w-fit bg-secondaryVariant rounded-lg border border-tertiaryVariant outline outline-tertiaryVariant'>{displayDurationInHMS(video.duration)}</div>
                </Link>
            </div>

            <Link className='titlelink '
                    href={`/video/${video.id}`}
                    target="_blank"
                    onClick={() => handleAddLastView(video)}>
                    <div className='title sm:w-112 md:w-full h-12 font-extrabold text-xl text-wrap text-tertiary underline underline-offset-4 decoration-primary'>{video.title}</div>
            </Link>
            <div className='content md:p-2'>
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
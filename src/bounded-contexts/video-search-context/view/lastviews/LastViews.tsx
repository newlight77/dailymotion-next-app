import React from 'react';
import Link from 'next/link'
import { FaUserPlus, FaHeartCirclePlus, FaCirclePlay } from 'react-icons/fa6';
import { useLastViews } from '../../hooks/LastViewsProvider';
import { useFavorites } from '../../hooks/FavoritesProvider';
import { LastViewType } from '../../domain/model/anime';
import { useFollowedVideoOwners } from '../../hooks/FollowedVideoOwnersProvider';
import RemovableItem from '@/components/molecules/RemovableItem';


interface Props {
    className?: string,
}


const LastViews: React.FC<Props> = ({ className }) => {
    const { items, remove, clear } = useLastViews();
    const useFollowing = useFollowedVideoOwners();
    const useFavorite = useFavorites();

    const handleAddToFavorites = async (lastView: LastViewType) => {
        useFavorite.addOrUpdate({uid: lastView.uid, animeId: '', title: lastView.title, order: 0});
    }

    const handleFollowOwner = async (lastView: LastViewType) => {
        useFollowing.addOrUpdate({uid: lastView.uid, owner: lastView.owner, order: 0});
    }

    const handleDelete = async (uid: string) => {
        remove(uid)
    }

    const keywords = (l: LastViewType) => encodeURIComponent(`${l.title} ${l.episode ? l.episode : ''}`)

    return (
        <div className={className}>
            <div className='text-md pl-4'>Last viewed videos keep track of what you have watched</div>
            <div className='lastviews-header pb-4'>
                <Link href={''} onClick={clear}>clear</Link>
            </div>
            <div className='flex flex-col gap-2'>
                { items ?.map(s => (
                    <RemovableItem onDelete={handleDelete} key={s.uid} id={s.uid}>
                        <Link className='col-span-1' href=''>
                            <FaHeartCirclePlus size={36} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => handleAddToFavorites(s)}/>
                        </Link>
                        <Link href={`/video/${s.videoId}`} className="col-span-1">
                            <FaCirclePlay size={32} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant"/>
                        </Link>
                        <Link href={''} className="col-span-5 flex" onClick={() => handleFollowOwner(s)}>
                            <FaUserPlus size={36} className="p-2 hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => handleFollowOwner(s)}/>
                            <span className='p-1 text-tertiary'>{`${s.owner}`}</span>
                        </Link>

                        <Link className="col-span-8" href={`/?keywords=${keywords(s)}`} >
                            <div className="col-span-5 hover:text-tertiary" >
                                <div className='underline underline-offset-4 decoration-primary'>{s.title}</div>
                                { s.episode ? <div>{s.episode}</div> : <></>}
                            </div>
                        </Link>

                    </RemovableItem>
                ))}
            </div>
        </div>
    );
};

export default LastViews;
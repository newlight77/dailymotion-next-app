import React from 'react';
import Link from 'next/link'
import { FaUserPlus, FaHeartCirclePlus, FaCirclePlay } from 'react-icons/fa6';
import { useLastViews } from '../../hooks/LastViewsProvider';
import { useFavorites } from '../../hooks/FavoritesProvider';
import { LastViewType } from '../../domain/model/anime';
import { useFollowedVideoOwners } from '../../hooks/FollowedVideoOwnersProvider';
import RemovableItem from '@/components/molecules/RemovableItem';
import SelactableItem from '@/components/molecules/Selectable';

interface Props {
    onSelected: (lastView: LastViewType) => void,
    className?: string,
}


const LastViews: React.FC<Props> = ({ onSelected, className }) => {
    const { items, remove, clear } = useLastViews();
    const useFollowing = useFollowedVideoOwners();
    const useFavorite = useFavorites();

    const handleAddToFavorites = async (lastView: LastViewType) => {
        useFavorite.addOrUpdate({uid: lastView.uid, title: lastView.title, order: 0});
    }

    const handleFollowOwner = async (lastView: LastViewType) => {
        useFollowing.addOrUpdate({uid: lastView.uid, owner: lastView.owner, order: 0});
    }

    const selectLastView = async (selected: LastViewType) => {
        onSelected(selected)
        // no navigate to /search/keywords or other pages, because here we should not know about how pages are structured
    }

    const handleDelete = async (uid: string) => {
        remove(uid)
    }

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

                        <SelactableItem className="col-span-8" onSelect={() => selectLastView(s)} >
                        {`${s.title} ${s.episode ? '(' + s.episode + ')': ''}` }
                        </SelactableItem>

                    </RemovableItem>
                ))}
            </div>
        </div>
    );
};

export default LastViews;
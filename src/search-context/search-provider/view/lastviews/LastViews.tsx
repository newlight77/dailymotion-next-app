import React from 'react';
import Link from 'next/link'
import { FaSquareMinus, FaUserPlus, FaHeartCirclePlus, FaCirclePlay } from 'react-icons/fa6';
import { useLastViews } from '../../hooks/LastViewsProvider';
import { useFavorites } from '../../hooks/FavoritesProvider';
import { LastViewType } from '../../domain/anime';
import { useFollowings } from '../../hooks/FollowingsProvider';

interface Props {
    onSelected: (lastView: LastViewType) => void,
    className?: string,
}


const LastViews: React.FC<Props> = ({ onSelected, className }) => {
    const { items, remove, clear } = useLastViews();
    const useFollowing = useFollowings();
    const useFavority = useFavorites();

    const handleAddToFavorites = async (lastView: LastViewType) => {
        useFavority.addOrUpdate({uid: crypto.randomUUID().toString(), title: lastView.title, order: 0});
    }

    const handleFollowOwner = async (lastView: LastViewType) => {
        useFollowing.addOrUpdate({uid: crypto.randomUUID().toString(), owner: lastView.owner, order: 0});
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
            <div className='lastviews-header pb-4'>
                <Link href={''} onClick={clear}>clear</Link>
            </div>
            <div className='flex flex-col gap-2'>
                { items ?.map(s => (
                    <div key={s.uid} className="grid grid-cols-8 gap-4 items-center hover:border rounded-md border-tertiary bg-secondaryVariant">
                        <Link className='col-span-1 p-1' href=''>
                            <FaSquareMinus size={24} className="hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => handleDelete(s.uid)}/>
                        </Link>
                        <Link className='col-span-1 p-1' href=''>
                            <FaHeartCirclePlus size={24} className="hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => handleAddToFavorites(s)}/>
                        </Link>
                        <Link href={`/video/${s.videoId}`} className="col-span-1 p-1 hover:border rounded-md border-tertiary bg-secondaryVariant">
                            <FaCirclePlay size={18} className=""/>
                        </Link>
                        <Link href={''} className="col-span-5 p-1 flex gap-1 items-center" onClick={() => handleFollowOwner(s)}>
                            <FaUserPlus size={20} className="hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => handleFollowOwner(s)}/>
                            <span className='p-1 text-tertiary'>{`${s.owner}`}</span>
                        </Link>

                        <div className="col-span-8" onClick={() => selectLastView(s)}>
                        {`${s.title} ${s.episode ? '(' + s.episode + ')': ''}` }
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default LastViews;
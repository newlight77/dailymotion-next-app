import React from 'react';
import Link from 'next/link'
import { useLastViews } from './LastViewsProvider';
import { useFollowings } from '../followings/FollowingsProvider';
import { useFavorites } from '../favorites/FavoritesProvider';

interface Props {
    onSelected: (lastView: LastViewType) => void,
    className?: string,
}

export type LastViewType = {
    uid: string,
    videoId: string,
    title: string,
    episode: string,
    owner: string,
    link: string,
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
                        <Link href={''} className="pl-2 col-span-1" onClick={() => handleAddToFavorites(s)}>
                            add to favorite
                        </Link>
                        <Link href={''} className="pl-2 col-span-1" onClick={() => handleFollowOwner(s)}>
                            {`follow ${s.owner}` }
                        </Link>
                        <Link href={`/video/${s.videoId}`} className="pl-2 col-span-1">
                            view again
                        </Link>
                        <Link href={''} className="pl-2 col-span-1" onClick={() => handleDelete(s.uid)}>
                            delete
                        </Link>
                        <div className="pl-2 col-span-4" onClick={() => selectLastView(s)}>
                        {`${s.title} ${s.episode ? '(' + s.episode + ')': ''}` }
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default LastViews;
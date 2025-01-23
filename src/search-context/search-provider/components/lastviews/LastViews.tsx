import React from 'react';
import Link from 'next/link'
import { useLastViews } from './LastViewsProvider';
import { useFollowings } from '../followings/FollowingsProvider';
import { useFavorites } from '../favorites/FavoritesProvider';

interface Props {
    onSelected: (lastView: LastViewType) => void;
}

export type LastViewType = {
    uid: string,
    videoId: string,
    title: string,
    episode: string,
    owner: string,
    link: string,
}

const LastViews: React.FC<Props> = ({ onSelected }) => {
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
    }

    const handleDelete = async (uid: string) => {
        remove(uid)
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div>
                <div className="pb-4">
                    <Link href={''} onClick={clear}>clear</Link>
                </div>
            </div>
            <div className='items-center'>
                { items ?.map(s => (
                    <div key={s.videoId} className="flex flex-row gap-4 items-center">
                        <Link href={''} className="basis-1/8" onClick={() => handleAddToFavorites(s)}>
                            add to favorite
                        </Link>
                        <Link href={''} className="basis-1/8" onClick={() => handleFollowOwner(s)}>
                                {`follow ${s.owner}` }
                        </Link>
                        <Link href={s.link} className="basis-1/8">
                            view
                        </Link>
                        <Link href={''} className="basis-1/8" onClick={() => handleDelete(s.uid)}>
                            delete
                        </Link>
                        <Link href={''} className="basis-1/2" onClick={() => selectLastView(s)}>
                        {`${s.title} ${s.episode ? '(' + s.episode + ')': ''}` }
                        </Link>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default LastViews;
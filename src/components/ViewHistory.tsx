import React, { useEffect } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'
import { Following } from './Followings';

interface ViewHistoryProps {
    newLastView?: LastView,
    onSelected: (lastView: LastView) => void;
    onAddToFavorite: (lastView: LastView) => void;
    onFollowOwner: (following: Following) => void;
}

export type LastView = {
    id: string,
    title: string,
    episode: string,
    owner: string,
    link: string,
}

const ViewHistory: React.FC<ViewHistoryProps> = ({ newLastView, onSelected, onAddToFavorite, onFollowOwner }) => {
    const [history, setHistory] = useLocalStorage<LastView[]>(`view-history`, []);
    const [show, setShow] = React.useState(false)

    const addToRecentViews = (lastView?: LastView) => {
        if (lastView && history) {
            const newHistory = [...history, lastView]
                .reduce<LastView[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
            setHistory(newHistory);
        }
    }

    useEffect(() => {
        addToRecentViews(newLastView);
    }, [newLastView]);

    const addToFavorites = async (lastView: LastView) => {
        onAddToFavorite(lastView);
    }

    const followOwner = async (lastView: LastView) => {
        onFollowOwner({uid: crypto.randomUUID().toString(), owner: lastView.owner, order: 0});
    }

    const selectLastView = async (selected: LastView) => {
        onSelected(selected)
    }

    const deleteHistory = async (id: string) => {
        if (history) {
            const newSearchHistory = history.filter(s => s.id !== id)
            setHistory(newSearchHistory);
            console.log('view history after ', id, newSearchHistory);
        }
    }

    const clearHistory = async () => {
        setHistory([]);
        console.log('clear view history ', history);
    }

    function toggleShowHide(): void {
        setShow(show ? false : true);
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div>
                <div className="flex flex-row pb-4 items-center">
                    <Link href={''} onClick={toggleShowHide}>
                    { show ? '' : 'show my recent views' }
                    </Link>
                    { show ?
                        <div>
                            <Link href={''} onClick={toggleShowHide}>
                                <h3>My recent views</h3>
                            </Link>
                            <Link href={''} onClick={clearHistory}>clear</Link>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
            <div className='items-center'>
                <div>
                    { show && history ?.map(s => (
                        <div key={s.id} className="flex flex-row gap-4 items-center">
                            <Link href={''} className="basis-1/8" onClick={() => addToFavorites(s)}>
                                add to favorite
                            </Link>
                            <Link href={''} className="basis-1/8" onClick={() => followOwner(s)}>
                                 {`follow ${s.owner}` }
                            </Link>
                            <Link href={s.link} className="basis-1/8">
                                view
                            </Link>
                            <Link href={''} className="basis-1/8" onClick={() => deleteHistory(s.id)}>
                                delete
                            </Link>
                            <Link href={''} className="basis-1/2" onClick={() => selectLastView(s)}>
                            {`${s.title} ${s.episode ? '(' + s.episode + ')': ''}` }
                            </Link>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewHistory;
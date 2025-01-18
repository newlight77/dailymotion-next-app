import React, { useEffect } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

interface ViewHistoryProps {
    newFollowing?: Following,
    onSelected?: (following: Following) => void;
}

export type Following = {
    uid: string,
    owner: string,
}

const Followings: React.FC<ViewHistoryProps> = ({ newFollowing }) => {
    const [followings, setFollowings] = useLocalStorage<Following[]>(`followings`, []);
    const [show, setShow] = React.useState(false)

    const addNewFollowing = (following?: Following) => {
        if (following && followings) {
            const updatedFollowings = [...followings, following]
                .reduce<Following[]>((acc, curr) => acc.some(item => item.owner === curr.owner) ? acc : [...acc, curr], []);
                setFollowings(updatedFollowings);
        }
    }

    useEffect(() => {
        addNewFollowing(newFollowing);
    }, [newFollowing]);

    const deleteFollowing = async (id: string) => {
        if (followings) {
            const newFollowingFollowings = followings.filter(s => s.uid !== id)
            setFollowings(newFollowingFollowings);
            console.log('delete following after ', id, newFollowingFollowings);
        }
    }

    const clearHistory = async () => {
        setFollowings([]);
        console.log('clear follwoing followings', history);
    }

    function toggleShowHide(): void {
        setShow(show ? false : true);
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div>
                <div className="flex flex-row pb-4 items-center">
                    <Link href={''} onClick={toggleShowHide}>
                    { show ? '' : 'show my followings' }
                    </Link>
                    { show ?
                        <div>
                            <Link href={''} onClick={toggleShowHide}>
                                <h3>My following followings</h3>
                            </Link>
                            <Link href={''} onClick={clearHistory}>clear followings</Link>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
            <div className='items-center'>
                <div>
                    { show && followings ?.map(s => (
                        <div key={s.uid} className="flex flex-row gap-4 items-center">
                            <Link href={''} className="basis-1/8" onClick={() => deleteFollowing(s.uid)}>
                                delete
                            </Link>
                            <Link href={`https://www.dailymotion.com/${s.owner}`} target="_blank" className="basis-1/2">
                                {`${s.owner}` }
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Followings;
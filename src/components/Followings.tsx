import React, { useEffect } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'
import followings from './data/followings';


const LOWEST_ORDER = Number.MAX_VALUE;

const FOLLOWINGS: Following[] = [
    ...followings,
]
.reduce<Following[]>((acc, curr) => acc.some(item => item.owner === curr.owner) ? acc : [...acc, curr], [])
.sort((a: Following, b: Following) => (a.order ?? LOWEST_ORDER) - (b.order ?? LOWEST_ORDER));


interface ViewFollowingsProps {
    newFollowing?: Following,
    onSelected?: (following: Following) => void;
}

export type Following = {
    uid: string,
    owner: string,
    order: number,
}

const Followings: React.FC<ViewFollowingsProps> = ({ newFollowing }) => {
    const [followings, setFollowings] = useLocalStorage<Following[]>(`followings`, FOLLOWINGS);

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

    const resetFollowings = () => {
        setFollowings(FOLLOWINGS);
    };

    const clearFollowings = async () => {
        setFollowings([]);
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div className='items-center'>
                <div>
                    { followings ?.map(s => (
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
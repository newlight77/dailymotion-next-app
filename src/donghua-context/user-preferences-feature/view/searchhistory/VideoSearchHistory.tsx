import React from 'react';
import Link from 'next/link'
import RemovableItem from '@/components/molecules/RemovableItem';
import { useVideoSearchHistory } from '../../hooks';


interface SearchBarProps {
    className?: string,
}


export const VideoSearchHistory: React.FC<SearchBarProps> = ({ className }) => {
    const useSearchHistory = useVideoSearchHistory();

    const handleDelete = async (uid: string) => {
        useSearchHistory.remove(uid)
    }

    const clearHistory = async () => {
        useSearchHistory.clear();
    }

    const keywords = (k: string) => encodeURIComponent(k)

    return (
        <div className={className}>
            <div className='text-md pl-4'>Last search history keep track of you searching keywords</div>
            <div className="pb-4">
                <Link href={''} onClick={clearHistory}>clear</Link>
            </div>
            <div className='flex flex-col gap-2'>
                { useSearchHistory.items?.map(s => (
                    <RemovableItem onDelete={handleDelete} key={s.uid} id={s.uid}>
                        <Link className="pl-2 col-span-11" href={`/?keywords=${keywords(s.keywords)}`} >
                            <div className="col-span-5 hover:text-tertiary" >
                                <div className='underline underline-offset-4 decoration-primary'>{s.keywords}</div>
                            </div>
                        </Link>
                    </RemovableItem>
                ))}
            </div>
        </div>
    );
};

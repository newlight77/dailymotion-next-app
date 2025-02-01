import React from 'react';
import Link from 'next/link'
import { useSearchHistory } from '../../hooks/SearchHistoryProvider';
import RemovableItem from '@/components/molecules/RemovableItem';

interface SearchBarProps {
    onSelected: (keywords: string) => void,
    className?: string,
}


const SearchHistory: React.FC<SearchBarProps> = ({ onSelected, className }) => {
    const { items, remove, clear } = useSearchHistory();

    const selectKeywords = async (selectedKeywords: string) => {
        onSelected(selectedKeywords)
        // no navigate to /search/keywords or other pages, because here we should not know about how pages are structured
    }

    const handleDelete = async (uid: string) => {
        remove(uid)
    }

    const clearHistory = async () => {
        clear();
    }

    return (
        <div className={className}>
            <div className="pb-4">
                <Link href={''} onClick={clearHistory}>clear</Link>
            </div>
            <div className='flex flex-col gap-2'>
                { items?.map(s => (
                    <RemovableItem onDelete={handleDelete} id={s.uid}>
                        <div className="pl-2 col-span-11" onClick={() => selectKeywords(s.keywords)}>
                            {s.keywords}
                        </div>
                    </RemovableItem>
                ))}
            </div>
        </div>
    );
};

export default SearchHistory;
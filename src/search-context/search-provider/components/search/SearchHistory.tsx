import React from 'react';
import Link from 'next/link'
import { FaSquareMinus } from 'react-icons/fa6';
import { useSearchHistory } from './SearchHistoryProvider';

interface SearchBarProps {
    onSelected: (keywords: string) => void,
    className?: string,
}

export type SearchKeywordsType = {
    uid: string,
    keywords: string,
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
                    <div key={s.uid} className="grid grid-cols-12 gap-4 items-center hover:border rounded-md border-tertiary bg-secondaryVariant">
                        <Link className='col-span-1 p-1' href=''>
                            <FaSquareMinus size={24} className="hover:border rounded-md border-tertiary bg-secondaryVariant" onClick={() => handleDelete(s.uid)}/>
                        </Link>

                        <div className="pl-2 col-span-11" onClick={() => selectKeywords(s.keywords)}>
                            {s.keywords}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchHistory;
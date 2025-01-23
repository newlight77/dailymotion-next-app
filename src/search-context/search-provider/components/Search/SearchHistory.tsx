import React from 'react';
import Link from 'next/link'
import { useSearchHistory } from './SearchHistoryProvider';

interface SearchBarProps {
    onSelected: (keywords: string) => void;
}

export type SearchKeywordsType = {
    uid: string,
    keywords: string,
}

const SearchHistory: React.FC<SearchBarProps> = ({ onSelected }) => {
    const { items, remove, clear } = useSearchHistory();

    const selectKeywords = async (selectedKeywords: string) => {
        onSelected(selectedKeywords)
        // no navigate to /search/keywords or other pages, because here we should not know about how pages are structured
    }

    const handleDeleteFromHistory = async (uid: string) => {
        remove(uid)
    }

    const clearHistory = async () => {
        clear();
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div>
                <div className="pb-4">
                    <Link href={''} onClick={clearHistory}>clear</Link>
                </div>
            </div>
            <div>
                <div>
                    <div>
                    { items?.map(s => (
                        <div key={s.uid} className="flex flex-row gap-4 items-center">
                            <Link href={''} className="basis-1/8" onClick={() => handleDeleteFromHistory(s.uid)}>
                                delete
                            </Link>
                            <div className="basis-1/2" onClick={() => selectKeywords(s.keywords)}>
                                {s.keywords}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHistory;
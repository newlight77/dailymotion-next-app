import React, { useEffect } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

interface SearchBarProps {
    newKeywords?: string,
    onSelected: (keywords: string) => void;
    onAddToFavorite: (keywords: string) => void;
}

type SearchKeywords = {
    uid: string,
    keywords: string,
}

const SearchHistory: React.FC<SearchBarProps> = ({ newKeywords, onSelected, onAddToFavorite }) => {
    const [history, setHistory] = useLocalStorage<SearchKeywords[]>(`search-history`, []);
    const [show, setShow] = React.useState(false)

    const addToHistory = (newKeywords?: string) => {
        if (newKeywords && history) {
            const searchKeywords: SearchKeywords = {uid: crypto.randomUUID().toString(), keywords: newKeywords}
            const newHistory = [searchKeywords, ...history]
                .reduce<SearchKeywords[]>((acc, curr) => acc.some(item => item.keywords === curr.keywords) ? acc : [...acc, curr], []);
            setHistory(newHistory);
        }
    }

    useEffect(() => {
        addToHistory(newKeywords);
    }, [newKeywords]);

    const addToFavorites = async (keywords: string) => {
        onAddToFavorite(keywords);
    }

    const selectKeywords = async (selectedKeywords: string) => {
        onSelected(selectedKeywords)
    }

    const deleteFromHistory = async (uid: string) => {
        if (history) {
            const newHistory = history.filter(s => s.uid !== uid)
            setHistory(newHistory);
        }
    }

    const clearHistory = async () => {
        setHistory([]);
    }

    function toggleShowHide(): void {
        setShow(show ? false : true);
    }

    return (
        <div className="p-1 md:gap-4 md:p-4 sm:p-1 sm:gap-1">
            <div>
                <div className="flex flex-row pb-4 items-center">
                    <Link href={''} onClick={toggleShowHide}>
                    { show ? '' : 'show my recent searches' }
                    </Link>
                    { show ?
                        <div>
                            <Link href={''} onClick={toggleShowHide}>
                                <h3>My recent searches</h3>
                            </Link>
                            <Link href={''} onClick={clearHistory}>clear</Link>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
            <div>
                {
                    show ?
                    <div>
                        <div>
                        { history?.map(s => (
                            <div key={s.uid} className="flex flex-row gap-4 items-center">
                                <Link href={''} className="basis-1/8" onClick={() => addToFavorites(s.keywords)}>
                                    add to favorite
                                </Link>
                                <Link href={''} className="basis-1/8" onClick={() => deleteFromHistory(s.uid)}>
                                    delete
                                </Link>
                                <Link href={''} className="basis-1/2" onClick={() => selectKeywords(s.keywords)}>
                                    {s.keywords}
                                </Link>
                            </div>
                        ))}
                        </div>
                    </div>
                    :
                    <></>
            }
            </div>
        </div>
    );
};

export default SearchHistory;
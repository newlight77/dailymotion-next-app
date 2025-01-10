import React, { useEffect } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

interface SearchBarProps {
    newKeywords?: string,
    onSelected: (keywords: string) => void;
    onAddToFavorite: (keywords: string) => void;

}

type SearchKeywords = {
    id: string,
    keywords: string,
}

const SearchHistory: React.FC<SearchBarProps> = ({ newKeywords, onSelected, onAddToFavorite }) => {
    const [history, setHistory] = useLocalStorage<SearchKeywords[]>(`search-history`, []);
    const [show, setShow] = React.useState(false)

    const addToHistory = (newKeywords?: string) => {
        if (newKeywords && history) {
            const searchKeywords: SearchKeywords = {id: crypto.randomUUID().toString(), keywords: newKeywords}
            const newHistory = [searchKeywords, ...history]
                .reduce<SearchKeywords[]>((acc, curr) => acc.some(item => item.keywords === curr.keywords) ? acc : [...acc, curr], []);
            setHistory(newHistory);
        }
    }

    useEffect(() => {
        addToHistory(newKeywords);
    }, [newKeywords]);

    const addKeywordsToFavorites = async (keywords: string) => {
        onAddToFavorite(keywords);
    }

    const selectKeywordsFavorites = async (selectedKeywords: string) => {
        onSelected(selectedKeywords)
    }

    const deleteKeywordsHistory = async (id: string) => {
        if (history) {
            const newHistory = history.filter(s => s.id !== id)
            setHistory(newHistory);
        }
    }

    const clearSearchKeywordsHistory = async () => {
        setHistory([]);
    }

    function toggleShowHide(): void {
        setShow(show ? false : true);
    }

    return (
        <div className="gap-4 p-4">
            <div>
                <div className="flex flex-row p-1 pb-4 items-center">
                    <Link href={''} onClick={toggleShowHide}>
                    { show ? '' : 'show recent searches' }
                    </Link>
                    { show ?
                        <div>
                            <Link href={''} onClick={toggleShowHide}>
                                <h3>My recent searches</h3>
                            </Link>
                            <Link href={''} onClick={clearSearchKeywordsHistory}>clear history</Link>
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
                            <div key={s.id} className="flex flex-row gap-4 items-center">
                                <Link href={''} className="basis-1/8" onClick={() => addKeywordsToFavorites(s.keywords)}>
                                    add to favorite
                                </Link>
                                <Link href={''} className="basis-1/8" onClick={() => deleteKeywordsHistory(s.id)}>
                                    delete
                                </Link>
                                <Link href={''} className="basis-1/2" onClick={() => selectKeywordsFavorites(s.keywords)}>
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
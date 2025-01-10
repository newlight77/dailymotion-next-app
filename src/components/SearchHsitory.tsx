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
    const [searchHistory, setSearchHistory] = useLocalStorage<SearchKeywords[]>(`search-history`, []);
    const [show, setShow] = React.useState(false)

    const addToHistory = (newKeywords?: string) => {
        if (newKeywords && searchHistory) {
            const searchKeywords: SearchKeywords = {id: crypto.randomUUID().toString(), keywords: newKeywords}
            const newSearchHistory = [searchKeywords, ...searchHistory]
                .reduce<SearchKeywords[]>((acc, curr) => acc.some(item => item.keywords === curr.keywords) ? acc : [...acc, curr], []);
            setSearchHistory(newSearchHistory);
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
        if (searchHistory) {
            const newSearchHistory = searchHistory.filter(s => s.id !== id)
            setSearchHistory(newSearchHistory);
            console.log('searchHistory after ', id, newSearchHistory);
        }
    }

    const clearSearchKeywordsHistory = async () => {
        setSearchHistory([]);
        console.log('clearSearchHistory ', searchHistory);
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
                        { searchHistory?.map(s => (
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
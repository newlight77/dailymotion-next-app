import React, { useEffect } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

const favorites: SearchKeywords[] = [
    { id: crypto.randomUUID().toString(), keywords: 'Battle through the Heaven' },
    { id: crypto.randomUUID().toString(), keywords: 'Perfect world' },
    { id: crypto.randomUUID().toString(), keywords: 'Soul land 2 ' },
    { id: crypto.randomUUID().toString(), keywords: 'Renegate immortal ' },
    { id: crypto.randomUUID().toString(), keywords: 'Shrouting the heaveans' },
    { id: crypto.randomUUID().toString(), keywords: 'Swallowed star' },
    { id: crypto.randomUUID().toString(), keywords: 'My senior brother is too steady' },
    { id: crypto.randomUUID().toString(), keywords: 'Martial universe' },
    { id: crypto.randomUUID().toString(), keywords: 'Tomb of fallen gods' },

    { id: crypto.randomUUID().toString(), keywords: 'Alchemy Supreme' },
    { id: crypto.randomUUID().toString(), keywords: 'Against the sky supreme' },
    { id: crypto.randomUUID().toString(), keywords: 'martial master' },
    { id: crypto.randomUUID().toString(), keywords: 'martial peak' },
    { id: crypto.randomUUID().toString(), keywords: 'Martial inverse' },
    { id: crypto.randomUUID().toString(), keywords: 'lord of all lords' },
    { id: crypto.randomUUID().toString(), keywords: 'lord of wonderlands' },
    { id: crypto.randomUUID().toString(), keywords: 'master of all worlds' },
    { id: crypto.randomUUID().toString(), keywords: 'divine lord of the heavens' },
    { id: crypto.randomUUID().toString(), keywords: 'myriad realms supreme' },

    { id: crypto.randomUUID().toString(), keywords: 'Tales of demons and gods' },
    { id: crypto.randomUUID().toString(), keywords: 'Magic chef of ice and fire' },
    { id: crypto.randomUUID().toString(), keywords: 'The Peak of True Martial Arts' },
    { id: crypto.randomUUID().toString(), keywords: 'Apotheosis' },

    { id: crypto.randomUUID().toString(), keywords: 'Peerless Martial Spirit' },
    { id: crypto.randomUUID().toString(), keywords: 'Peerless Battle Spirit' },
    { id: crypto.randomUUID().toString(), keywords: 'carp reborn' },
    { id: crypto.randomUUID().toString(), keywords: 'Throne of Seal ' },
    { id: crypto.randomUUID().toString(), keywords: 'Dragon’s disciple' },
    { id: crypto.randomUUID().toString(), keywords: 'great journey of teenagers' },
    { id: crypto.randomUUID().toString(), keywords: 'A Mortal’s Journey to Immortality' },
    { id: crypto.randomUUID().toString(), keywords: 'Stellar Tranformation' },

    { id: crypto.randomUUID().toString(), keywords: 'Hidden Sect Leader' },
    { id: crypto.randomUUID().toString(), keywords: 'Spiritual Lord of Chaos' },
    { id: crypto.randomUUID().toString(), keywords: 'The Secrets of Star Divine Arts' },
    { id: crypto.randomUUID().toString(), keywords: 'Grandmaster of Alchemy' },
    { id: crypto.randomUUID().toString(), keywords: 'The great ruler' },
    { id: crypto.randomUUID().toString(), keywords: 'against the gods - nitian xie shen' },
    { id: crypto.randomUUID().toString(), keywords: 'Stellar transformation' },
    { id: crypto.randomUUID().toString(), keywords: 'Nirvana of storm rider' },
    { id: crypto.randomUUID().toString(), keywords: 'Mortal journey to immortality' },
    { id: crypto.randomUUID().toString(), keywords: 'Battle through the heavens' },
    { id: crypto.randomUUID().toString(), keywords: 'Legend of xianwu' },
    { id: crypto.randomUUID().toString(), keywords: 'Yishi Zhi Zun ' },
    { id: crypto.randomUUID().toString(), keywords: 'Ancient Lords' },
    { id: crypto.randomUUID().toString(), keywords: 'tales of dark river' },
    { id: crypto.randomUUID().toString(), keywords: 'Throne of seal' },
    { id: crypto.randomUUID().toString(), keywords: 'Jade Dynasty 7' },
    { id: crypto.randomUUID().toString(), keywords: 'Thousand Autumn' },
    { id: crypto.randomUUID().toString(), keywords: 'The Legend of the Taiyi Sword Immortal' },
    { id: crypto.randomUUID().toString(), keywords: 'Stop at the level of Refining Qi for 100,000 years' },
    { id: crypto.randomUUID().toString(), keywords: 'Soul of light' },
    { id: crypto.randomUUID().toString(), keywords: 'The island of sailing' },
    { id: crypto.randomUUID().toString(), keywords: 'Purple river' },
    { id: crypto.randomUUID().toString(), keywords: 'Word of Honor' },
    { id: crypto.randomUUID().toString(), keywords: 'Millenniums Of Warring States' },
    { id: crypto.randomUUID().toString(), keywords: 'The Galaxy Emperor' },
    { id: crypto.randomUUID().toString(), keywords: 'A Will Eternal' },
    { id: crypto.randomUUID().toString(), keywords: 'five elements' },
    { id: crypto.randomUUID().toString(), keywords: 'Dinghai Floating Records' },
    { id: crypto.randomUUID().toString(), keywords: 'Thousands of worlds' },
    { id: crypto.randomUUID().toString(), keywords: 'Epic of Divinity Light' },
    { id: crypto.randomUUID().toString(), keywords: 'Immortals of the Godless Age' },
    { id: crypto.randomUUID().toString(), keywords: 'Martial God' },
    { id: crypto.randomUUID().toString(), keywords: 'egend of Exorcism' },
    { id: crypto.randomUUID().toString(), keywords: 'Legend of Tang' },
    { id: crypto.randomUUID().toString(), keywords: 'The Young Brewmaster Adventure' },
    { id: crypto.randomUUID().toString(), keywords: 'Legend of sword domain' },
    { id: crypto.randomUUID().toString(), keywords: 'ancient Myth' },
    { id: crypto.randomUUID().toString(), keywords: 'The Legend of Dragon Soldier' },
    { id: crypto.randomUUID().toString(), keywords: 'My Journey in an Alternate World' },
    { id: crypto.randomUUID().toString(), keywords: 'The Tale of The Spirit Stone' },
    { id: crypto.randomUUID().toString(), keywords: 'Wonderland of ten thousands' },
    { id: crypto.randomUUID().toString(), keywords: 'The lord of no boundary' },
    { id: crypto.randomUUID().toString(), keywords: 'The God of Ten Thousand Realms' },
    { id: crypto.randomUUID().toString(), keywords: 'Supreme god emperor' },
    { id: crypto.randomUUID().toString(), keywords: 'Spirit sword sovereign' },
    { id: crypto.randomUUID().toString(), keywords: 'Supreme Lord of Galaxy' },
    { id: crypto.randomUUID().toString(), keywords: 'The Sovereign of All Realms' },
    { id: crypto.randomUUID().toString(), keywords: 'mad demon lord' },
    { id: crypto.randomUUID().toString(), keywords: 'Snow Eagle Lord' },
    { id: crypto.randomUUID().toString(), keywords: 'Lord of planets' },
    { id: crypto.randomUUID().toString(), keywords: 'Chronicles of Everlasting Wind and Sword Rain' },
    { id: crypto.randomUUID().toString(), keywords: 'Chief Soul Manipulator' },
    { id: crypto.randomUUID().toString(), keywords: 'Meteor Magic Sword' },
    { id: crypto.randomUUID().toString(), keywords: 'Proud Swordsman' },
    { id: crypto.randomUUID().toString(), keywords: 'Lingwu Continent' },
    { id: crypto.randomUUID().toString(), keywords: 'Glorious Revenge of Ye Feng' },
    { id: crypto.randomUUID().toString(), keywords: 'Apotheosis' },
]
.reduce<SearchKeywords[]>((acc, curr) => acc.some(item => item.keywords === curr.keywords) ? acc : [...acc, curr], [])
// .sort((a: SearchKeywords, b: SearchKeywords) => a.keywords.localeCompare(b.keywords));

interface SearchFavoritesProps {
    newKeywords?: string,
    onSelected: (keywords: string) => void;
}

type SearchKeywords = {
    id: string,
    keywords: string,
}

const SearchFavorites: React.FC<SearchFavoritesProps> = ({ newKeywords, onSelected }) => {
    const [searchFavorites, setSearchFavorites] = useLocalStorage<SearchKeywords[]>(`favorites`, favorites);

    // console.log('searchFavorites ', favorites, searchFavorites);

    const addToFavorites = (keywords?: string) => {
        if (keywords && searchFavorites) {
            const searchKeywords: SearchKeywords = {id: crypto.randomUUID().toString(), keywords: keywords}
            const newSearchHistory = [...searchFavorites, searchKeywords]
                .reduce<SearchKeywords[]>((acc, curr) => acc.some(item => item.keywords === curr.keywords) ? acc : [...acc, curr], []);
            setSearchFavorites(newSearchHistory);
        }
    }

    useEffect(() => {
        addToFavorites(newKeywords);
    }, [newKeywords]);

    const selectSearchKeywords = async (selectedKeywords: string) => {
        onSelected(selectedKeywords)
        // console.log('searchFavorites ', selectedKeywords, searchFavorites);
    }

    const deleteSearchKeywords = async (id: string) => {
        if (searchFavorites) {
            const newSearchFavorties = searchFavorites.filter(s => s.id !== id)
            setSearchFavorites(newSearchFavorties);
            // console.log('searchFavorites after ', id, newSearchFavorties);
        }
    }

    function resetFavorites(): void {
        setSearchFavorites(favorites);
    }

    return (
        <div>
            <h2>favorties</h2>
            <div className='items-center'>
                <div>
                    { searchFavorites?.map(kw => (
                        <div key={crypto.randomUUID().toString()} className="flex flex-wrap gap-4 items-center">
                            {/* <div className="basis-1/2"> */}
                                {/* <div className="flex flex-row gap-4 items-center"> */}
                                    <Link href={''} className="basis-1/8" onClick={() => deleteSearchKeywords(kw.id)}>
                                        delete
                                    </Link>
                                    <Link href={''} className="basis-1/2" onClick={() => selectSearchKeywords(kw.keywords)}>
                                        {kw.keywords}
                                    </Link>
                                {/* </div> */}
                            {/* </div> */}
                        </div>
                    ))}
                </div>
                <button onClick={resetFavorites}>reset favorites</button>
            </div>
        </div>
    );
};

export default SearchFavorites;
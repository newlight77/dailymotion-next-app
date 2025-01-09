import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

const FAVORITES: FavoriteWithEpisodes[] = [
    { id: crypto.randomUUID().toString(), title: 'Battle through the Heaven' },
    { id: crypto.randomUUID().toString(), title: 'Perfect world' },
    { id: crypto.randomUUID().toString(), title: 'Soul land 2 ' },
    { id: crypto.randomUUID().toString(), title: 'Renegate immortal ' },
    { id: crypto.randomUUID().toString(), title: 'Shrouting the heaveans' },
    { id: crypto.randomUUID().toString(), title: 'Swallowed star' },
    { id: crypto.randomUUID().toString(), title: 'My senior brother is too steady' },
    { id: crypto.randomUUID().toString(), title: 'Martial universe' },
    { id: crypto.randomUUID().toString(), title: 'Tomb of fallen gods' },

    { id: crypto.randomUUID().toString(), title: 'Alchemy Supreme' },
    { id: crypto.randomUUID().toString(), title: 'Against the sky supreme' },
    { id: crypto.randomUUID().toString(), title: 'martial master' },
    { id: crypto.randomUUID().toString(), title: 'martial peak' },
    { id: crypto.randomUUID().toString(), title: 'Martial inverse' },
    { id: crypto.randomUUID().toString(), title: 'lord of all lords' },
    { id: crypto.randomUUID().toString(), title: 'lord of wonderlands' },
    { id: crypto.randomUUID().toString(), title: 'master of all worlds' },
    { id: crypto.randomUUID().toString(), title: 'divine lord of the heavens' },
    { id: crypto.randomUUID().toString(), title: 'myriad realms supreme' },
    { id: crypto.randomUUID().toString(), title: 'Supreme god emperor' },

    { id: crypto.randomUUID().toString(), title: 'Tales of demons and gods' },
    { id: crypto.randomUUID().toString(), title: 'Magic chef of ice and fire' },
    { id: crypto.randomUUID().toString(), title: 'The Peak of True Martial Arts' },
    { id: crypto.randomUUID().toString(), title: 'Apotheosis' },

    { id: crypto.randomUUID().toString(), title: 'Peerless Martial Spirit' },
    { id: crypto.randomUUID().toString(), title: 'Peerless Battle Spirit' },
    { id: crypto.randomUUID().toString(), title: 'carp reborn' },
    { id: crypto.randomUUID().toString(), title: 'Throne of Seal ' },
    { id: crypto.randomUUID().toString(), title: 'Dragon’s disciple' },
    { id: crypto.randomUUID().toString(), title: 'great journey of teenagers' },
    { id: crypto.randomUUID().toString(), title: 'A Mortal’s Journey to Immortality' },
    { id: crypto.randomUUID().toString(), title: 'Stellar Tranformation' },

    { id: crypto.randomUUID().toString(), title: 'Hidden Sect Leader' },
    { id: crypto.randomUUID().toString(), title: 'Spiritual Lord of Chaos' },
    { id: crypto.randomUUID().toString(), title: 'The Secrets of Star Divine Arts' },
    { id: crypto.randomUUID().toString(), title: 'Grandmaster of Alchemy' },
    { id: crypto.randomUUID().toString(), title: 'The great ruler' },
    { id: crypto.randomUUID().toString(), title: 'against the gods - nitian xie shen' },
    { id: crypto.randomUUID().toString(), title: 'Stellar transformation' },
    { id: crypto.randomUUID().toString(), title: 'Nirvana of storm rider' },
    { id: crypto.randomUUID().toString(), title: 'Mortal journey to immortality' },
    { id: crypto.randomUUID().toString(), title: 'Legend of xianwu' },
    { id: crypto.randomUUID().toString(), title: 'Yishi Zhi Zun ' },
    { id: crypto.randomUUID().toString(), title: 'Ancient Lords' },
    { id: crypto.randomUUID().toString(), title: 'tales of dark river' },
    { id: crypto.randomUUID().toString(), title: 'Throne of seal' },
    { id: crypto.randomUUID().toString(), title: 'Jade Dynasty 7' },
    { id: crypto.randomUUID().toString(), title: 'Thousand Autumn' },
    { id: crypto.randomUUID().toString(), title: 'The Legend of the Taiyi Sword Immortal' },
    { id: crypto.randomUUID().toString(), title: 'Stop at the level of Refining Qi for 100,000 years' },
    { id: crypto.randomUUID().toString(), title: 'Soul of light' },
    { id: crypto.randomUUID().toString(), title: 'The island of sailing' },
    { id: crypto.randomUUID().toString(), title: 'Purple river' },
    { id: crypto.randomUUID().toString(), title: 'Word of Honor' },
    { id: crypto.randomUUID().toString(), title: 'Millenniums Of Warring States' },
    { id: crypto.randomUUID().toString(), title: 'The Galaxy Emperor' },
    { id: crypto.randomUUID().toString(), title: 'A Will Eternal' },
    { id: crypto.randomUUID().toString(), title: 'five elements' },
    { id: crypto.randomUUID().toString(), title: 'Dinghai Floating Records' },
    { id: crypto.randomUUID().toString(), title: 'Thousands of worlds' },
    { id: crypto.randomUUID().toString(), title: 'Epic of Divinity Light' },
    { id: crypto.randomUUID().toString(), title: 'Immortals of the Godless Age' },
    { id: crypto.randomUUID().toString(), title: 'Martial God' },
    { id: crypto.randomUUID().toString(), title: 'egend of Exorcism' },
    { id: crypto.randomUUID().toString(), title: 'Legend of Tang' },
    { id: crypto.randomUUID().toString(), title: 'The Young Brewmaster Adventure' },
    { id: crypto.randomUUID().toString(), title: 'Legend of sword domain' },
    { id: crypto.randomUUID().toString(), title: 'ancient Myth' },
    { id: crypto.randomUUID().toString(), title: 'The Legend of Dragon Soldier' },
    { id: crypto.randomUUID().toString(), title: 'My Journey in an Alternate World' },
    { id: crypto.randomUUID().toString(), title: 'The Tale of The Spirit Stone' },
    { id: crypto.randomUUID().toString(), title: 'Wonderland of ten thousands' },
    { id: crypto.randomUUID().toString(), title: 'The lord of no boundary' },
    { id: crypto.randomUUID().toString(), title: 'The God of Ten Thousand Realms' },
    { id: crypto.randomUUID().toString(), title: 'Spirit sword sovereign' },
    { id: crypto.randomUUID().toString(), title: 'Supreme Lord of Galaxy' },
    { id: crypto.randomUUID().toString(), title: 'The Sovereign of All Realms' },
    { id: crypto.randomUUID().toString(), title: 'mad demon lord' },
    { id: crypto.randomUUID().toString(), title: 'Snow Eagle Lord' },
    { id: crypto.randomUUID().toString(), title: 'Lord of planets' },
    { id: crypto.randomUUID().toString(), title: 'Chronicles of Everlasting Wind and Sword Rain' },
    { id: crypto.randomUUID().toString(), title: 'Chief Soul Manipulator' },
    { id: crypto.randomUUID().toString(), title: 'Meteor Magic Sword' },
    { id: crypto.randomUUID().toString(), title: 'Proud Swordsman' },
    { id: crypto.randomUUID().toString(), title: 'Lingwu Continent' },
    { id: crypto.randomUUID().toString(), title: 'Glorious Revenge of Ye Feng' },
]
.reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], [])
// .sort((a: FavoriteType, b: FavoriteType) => a.title.localeCompare(b.title));

interface FavoritesProps {
    newFavorite?: FavoriteType,
    onSelected: (favorite: FavoriteWithEpisodes) => void;
}

export type FavoriteType = {
    id: string,
    title: string
}

export type FavoriteWithEpisodes = FavoriteType & {
    lastEpisode?: string,
    total?: number
}

const Favorites: React.FC<FavoritesProps> = ({ newFavorite, onSelected }) => {
    const [favorites, setFavorites] = useLocalStorage<FavoriteWithEpisodes[]>(`favorites`, FAVORITES);
    const [editMode, setEditMode] = useState(false);

    const addOrUpdate = (favorite?: FavoriteWithEpisodes) : FavoriteWithEpisodes | undefined => {
        if (favorite && favorites) {
            const newFavorite: FavoriteWithEpisodes = {
                id: favorite.id ? favorite.id : crypto.randomUUID().toString(),
                title: favorite.title,
                lastEpisode: favorite.lastEpisode,
                total: favorite.total
            }
            const newFavorites = [newFavorite, ...favorites]
                .reduce<FavoriteWithEpisodes[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], []);
            setFavorites(newFavorites);
            return newFavorite
        }
    }

    useEffect(() => {
        addOrUpdate(newFavorite);
    }, [newFavorite]);

    const selectFavorite = async (selected: FavoriteWithEpisodes) => {
        onSelected(selected)
    }

    const deleteFavorite = async (id: string) => {
        if (favorites) {
            const newFavorites = favorites.filter(s => s.id !== id)
            setFavorites(newFavorites);
        }
    }

    const handleLastEpisodeChange = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteWithEpisodes) => {
        if (event.target.value !== selected.lastEpisode ) {
            console.log('last episode change', selected.lastEpisode);
            const updated = addOrUpdate({ ...selected, lastEpisode: event.target.value });
            console.log('last episode updated', updated);
        }
    };

    // const handleLastEpisodeBlur = (event: React.ChangeEvent<HTMLInputElement>, selected: FavoriteWithEpisodes) => {
    //     if (event.target.value !== selected.lastEpisode ) {
    //         console.log('last episode change', event.target.value);
    //         const updated = addOrUpdate({ ...selected, lastEpisode: event.target.value });
    //         console.log('last episode updated', updated);
    //     }
    // };

    function resetFavorites(): void {
        setFavorites(FAVORITES);
    }

    function toggleEditFavorites(): void {
        setEditMode(editMode ? false : true);
    }

    return (
        <div>
            <h2>favorties</h2>
            <div className='items-center min-w-72'>
                <button onClick={toggleEditFavorites}>edit episode</button>
                <button onClick={resetFavorites}>reset</button>
                <div>
                    { favorites?.map(kw => (
                        <div key={crypto.randomUUID().toString()} className="flex flex-wrap gap-4 items-center">
                            <Link href={''} className="basis-1/8" onClick={() => deleteFavorite(kw.id)}>
                                delete
                            </Link>
                            <Link href={''} className="basis-5/8" onClick={() => selectFavorite(kw)}>
                                {`${kw.title} ${kw.total ? kw.total : ''}` }
                            </Link>

                            { editMode ?
                                <div>
                                    <input
                                        className='basis-1/8 min-w-8 max-w-28'
                                        type="text"
                                        value={kw.lastEpisode || ''}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleLastEpisodeChange(event, kw)}
                                        // onBlur={(event: React.ChangeEvent<HTMLInputElement>) => handleLastEpisodeBlur(event, kw) }
                                        placeholder="last episode"
                                    />
                                </div>
                            :
                                <div>
                                    <Link href={''} className="basis-1/8" onClick={() => selectFavorite(kw)}>
                                        {`${ kw.lastEpisode ? kw.lastEpisode : ''}` }
                                    </Link>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favorites;
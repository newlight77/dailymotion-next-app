import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/shared/useLocalStorage';
import Link from 'next/link'

const FAVORITES: FavoriteWithEpisodes[] = [
    { id: crypto.randomUUID().toString(), title: 'Battle through the Heaven'                              , lastEpisode: '125', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Perfect world'                                          , lastEpisode: '197', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Soul land 2 '                                           , lastEpisode: '82', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Renegate immortal '                                     , lastEpisode: '70', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Shrouting the heavens'                                  , lastEpisode: '91', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Swallowed star'                                         , lastEpisode: '153', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'My senior brother is too steady'                        , lastEpisode: '71', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Martial universe season 5'                              , lastEpisode: '3', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Tomb of fallen gods'                                    , lastEpisode: '39', total: 0 },

    { id: crypto.randomUUID().toString(), title: 'Alchemy Supreme'                                        , lastEpisode: '107', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Against the sky supreme'                                , lastEpisode: '373', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'martial master'                                         , lastEpisode: '510', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'martial peak'                                           , lastEpisode: '18', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Martial inverse'                                        , lastEpisode: '14', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'lord of all lords'                                      , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'lord of wonderlands'                                    , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'master of all worlds'                                   , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'divine lord of the heavens'                             , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'myriad realms supreme'                                  , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Supreme god emperor'                                    , lastEpisode: '', total: 0 },

    { id: crypto.randomUUID().toString(), title: 'Tales of demons and gods'                               , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Magic chef of ice and fire'                             , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Peak of True Martial Arts'                          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Apotheosis'                                             , lastEpisode: '', total: 0 },

    { id: crypto.randomUUID().toString(), title: 'Peerless Martial Spirit'                                , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Peerless Battle Spirit'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'carp reborn'                                            , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Throne of Seal '                                        , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Dragon’s disciple'                                      , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'great journey of teenagers'                             , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'A Mortal’s Journey to Immortality'                      , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Stellar Tranformation'                                  , lastEpisode: '', total: 0 },

    { id: crypto.randomUUID().toString(), title: 'Hidden Sect Leader'                                     , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Spiritual Lord of Chaos'                                , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Secrets of Star Divine Arts'                        , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Grandmaster of Alchemy'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The great ruler'                                        , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'against the gods - nitian xie shen'                     , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Stellar transformation'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Nirvana of storm rider'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Mortal journey to immortality'                          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Legend of xianwu'                                       , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Yishi Zhi Zun '                                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Ancient Lords'                                          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'tales of dark river'                                    , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Throne of seal'                                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Jade Dynasty 7'                                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Thousand Autumn'                                        , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Legend of the Taiyi Sword Immortal'                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Stop at the level of Refining Qi for 100,000 years'     , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Soul of light'                                          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The island of sailing'                                  , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Purple river'                                           , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Word of Honor'                                          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Millenniums Of Warring States'                          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Galaxy Emperor'                                     , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'A Will Eternal'                                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'five elements'                                          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Dinghai Floating Records'                               , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Thousands of worlds'                                    , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Epic of Divinity Light'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Immortals of the Godless Age'                           , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Martial God'                                            , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'egend of Exorcism'                                      , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Legend of Tang'                                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Young Brewmaster Adventure'                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Legend of sword domain'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'ancient Myth'                                           , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Legend of Dragon Soldier'                           , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'My Journey in an Alternate World'                       , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Tale of The Spirit Stone'                           , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Wonderland of ten thousands'                            , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The lord of no boundary'                                , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The God of Ten Thousand Realms'                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Spirit sword sovereign'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Supreme Lord of Galaxy'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'The Sovereign of All Realms'                            , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'mad demon lord'                                         , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Snow Eagle Lord'                                        , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Lord of planets'                                        , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Chronicles of Everlasting Wind and Sword Rain'          , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Chief Soul Manipulator'                                 , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Meteor Magic Sword'                                     , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Proud Swordsman'                                        , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Lingwu Continent'                                       , lastEpisode: '', total: 0 },
    { id: crypto.randomUUID().toString(), title: 'Glorious Revenge of Ye Feng'                            , lastEpisode: '', total: 0 },
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
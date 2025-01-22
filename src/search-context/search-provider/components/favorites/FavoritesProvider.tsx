'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import serie from '@/data/series';

import { FavoriteType } from "./Favorites";


const LOWEST_ORDER = Number.MAX_VALUE;

const FAVORITES: FavoriteType[] = [
    ...serie,
]
// dedup
// .reduce<FavoriteType[]>((acc, curr) => acc.some(item => item.title === curr.title) ? acc : [...acc, curr], [])
.sort((a: FavoriteType, b: FavoriteType) => (a.order ?? LOWEST_ORDER) - (b.order ?? LOWEST_ORDER));



export interface FavoriteContextType {
  item: FavoriteType | undefined,
  items: FavoriteType[] | undefined,
  remove: (uid: string) => void,
  addOrUpdate: (value: FavoriteType) => void,
  loadData: (data: FavoriteType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const FavoritesContext = createContext<FavoriteContextType>({
  item: undefined,
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FavoriteType) => { console.log('add or update', value) },
  loadData: (data: FavoriteType[]) => { console.log('load data', data) },
  reset: () => {},
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const FavoritesProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, remove, addOrUpdate, loadData, reset, clear} = useStorage<FavoriteType>(`favorites`, FAVORITES);

  const memoedValue = useMemo(
    () => ({
      item,
      items,
      remove,
      addOrUpdate,
      loadData,
      reset,
      clear
    }),
    [items, items, addOrUpdate, loadData, reset, reset, clear]
  );

  return (
      <FavoritesContext.Provider value={ memoedValue }>
          { children }
      </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoriteContextType => useContext(FavoritesContext)

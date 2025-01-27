'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import animelist from '@/data/animelist';
import { AnimeType } from '../domain/anime';


const ANIMELIST: AnimeType[] = [
    ...animelist,
]
.sort((a: AnimeType, b: AnimeType) => a.title.localeCompare(b.title));

export interface AnimelistContextType {
  item: AnimeType | undefined,
  items: AnimeType[] | undefined,
  remove: (uid: string) => void,
  addOrUpdate: (value: AnimeType) => void,
  loadData: (data: AnimeType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const AnimelistContext = createContext<AnimelistContextType>({
  item: undefined,
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: AnimeType) => { console.log('add or update', value) },
  loadData: (data: AnimeType[]) => { console.log('load data', data) },
  reset: () => {},
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const AnimeListProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, remove, addOrUpdate, loadData, reset, clear} = useStorage<AnimeType>(`animelist`, ANIMELIST);

  // todo: using adapter to get animelist

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
      <AnimelistContext.Provider value={ memoedValue }>
          { children }
      </AnimelistContext.Provider>
  )
}

export const useAnimelist = (): AnimelistContextType => useContext(AnimelistContext)

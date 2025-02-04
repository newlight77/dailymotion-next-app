'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import { FollowedAnimeType } from '../domain/model/anime';


export interface FollowedAnimesContextType {
  item: FollowedAnimeType | undefined,
  items: FollowedAnimeType[] | undefined,
  remove: (uid: string) => void,
  addOrUpdate: (value: FollowedAnimeType) => void,
  loadData: (data: FollowedAnimeType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const FollowedAnimesContext = createContext<FollowedAnimesContextType>({
  item: undefined,
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FollowedAnimeType) => { console.log('add or update', value) },
  loadData: (data: FollowedAnimeType[]) => { console.log('load data', data) },
  reset: () => {},
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const FollowedAnimesProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, remove, addOrUpdate, loadData, reset, clear} = useStorage<FollowedAnimeType>(`followed-animes`, []);

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
    [item, items, addOrUpdate, loadData, reset, reset, clear]
  );

  return (
      <FollowedAnimesContext.Provider value={ memoedValue }>
          { children }
      </FollowedAnimesContext.Provider>
  )
}

export const useFollowedAnimes = (): FollowedAnimesContextType => useContext(FollowedAnimesContext)

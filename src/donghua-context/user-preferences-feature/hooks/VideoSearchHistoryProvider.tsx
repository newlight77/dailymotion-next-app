'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import { SearchKeywordsType } from '../domain';


export interface VideoSearchHistoryContextType {
  item: SearchKeywordsType | undefined,
  items: SearchKeywordsType[] | undefined,
  addOrUpdate: (value: SearchKeywordsType) => void,
  remove: (uid: string) => void,
  clear: () => void,
}

export const VideoSearchHistoryContext = createContext<VideoSearchHistoryContextType>({
  item: undefined,
  items: [],
  addOrUpdate: (value: SearchKeywordsType) => { console.log('add or update', value) },
  remove: (uid: string) => { console.log('remove', uid) },
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const VideoSearchHistoryProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, addOrUpdate, remove, clear} = useStorage<SearchKeywordsType>(`last-searches`, []);

  const memoedValue = useMemo(
    () => ({
      item,
      items,
      addOrUpdate,
      remove,
      clear
    }),
    [item, items, addOrUpdate, remove, clear]
  );

  return (
      <VideoSearchHistoryContext.Provider value={ memoedValue }>
          { children }
      </VideoSearchHistoryContext.Provider>
  )
}

export const useVideoSearchHistory = (): VideoSearchHistoryContextType => useContext(VideoSearchHistoryContext)

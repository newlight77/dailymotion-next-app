'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import { SearchKeywordsType } from '../components/search/SearchHistory';


export interface SearchHistoryContextType {
  item: SearchKeywordsType | undefined,
  items: SearchKeywordsType[] | undefined,
  addOrUpdate: (value: SearchKeywordsType) => void,
  remove: (uid: string) => void,
  clear: () => void,
}

export const SearchHistoryContext = createContext<SearchHistoryContextType>({
  item: undefined,
  items: [],
  addOrUpdate: (value: SearchKeywordsType) => { console.log('add or update', value) },
  remove: (uid: string) => { console.log('remove', uid) },
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const SearchHistoryProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, addOrUpdate, remove, clear} = useStorage<SearchKeywordsType>(`last-searches`, []);

  const memoedValue = useMemo(
    () => ({
      item,
      items,
      addOrUpdate,
      remove,
      clear
    }),
    [items, items, addOrUpdate, remove, clear]
  );

  return (
      <SearchHistoryContext.Provider value={ memoedValue }>
          { children }
      </SearchHistoryContext.Provider>
  )
}

export const useSearchHistory = (): SearchHistoryContextType => useContext(SearchHistoryContext)

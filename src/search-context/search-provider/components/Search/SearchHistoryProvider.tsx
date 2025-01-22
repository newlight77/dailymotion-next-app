'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';

import { SearchKeywordsType } from './SearchHistory';



export interface SearchHistoryContextType {
  item: SearchKeywordsType | undefined,
  items: SearchKeywordsType[] | undefined,
  addOrUpdate: (value: SearchKeywordsType) => void,
  remove: (uid: string) => void,
  clear: () => void,
}

export const SearchHistorysContext = createContext<SearchHistoryContextType>({
  item: undefined,
  items: [],
  addOrUpdate: (value: SearchKeywordsType) => { console.log('add or update', value) },
  remove: (uid: string) => { console.log('remove', uid) },
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const SearchHistorysProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, addOrUpdate, remove, clear} = useStorage<SearchKeywordsType>(`followings`, []);

  const memoedValue = useMemo(
    () => ({
      item,
      items,
      addOrUpdate,
      remove,
      clear
    }),
    [items, items, remove, clear]
  );

  return (
      <SearchHistorysContext.Provider value={ memoedValue }>
          { children }
      </SearchHistorysContext.Provider>
  )
}

export const useSearchHistory = (): SearchHistoryContextType => useContext(SearchHistorysContext)

'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import { LastViewType } from '../domain/model/anime';


export interface LastViewContextType {
  item: LastViewType | undefined,
  items: LastViewType[] | undefined,
  addOrUpdate: (value: LastViewType) => void,
  remove: (uid: string) => void,
  clear: () => void,
}

export const LastViewsContext = createContext<LastViewContextType>({
  item: undefined,
  items: [],
  addOrUpdate: (value: LastViewType) => { console.log('add or update', value) },
  remove: (uid: string) => { console.log('remove', uid) },
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const LastViewsProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, addOrUpdate, remove, clear} = useStorage<LastViewType>(`last-views`, []);

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
      <LastViewsContext.Provider value={ memoedValue }>
          { children }
      </LastViewsContext.Provider>
  )
}

export const useLastViews = (): LastViewContextType => useContext(LastViewsContext)

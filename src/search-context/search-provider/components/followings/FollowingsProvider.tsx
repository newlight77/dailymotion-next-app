'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import followings from '@/data/followings';

import { FollowingType } from './Followings';


const LOWEST_ORDER = Number.MAX_VALUE;

const FOLLOWINGS: FollowingType[] = [
    ...followings,
]
// .reduce<FollowingType[]>((acc, curr) => acc.some(item => item.owner === curr.owner) ? acc : [...acc, curr], [])
.sort((a: FollowingType, b: FollowingType) => (a.order ?? LOWEST_ORDER) - (b.order ?? LOWEST_ORDER));


export interface FollowingContextType {
  item: FollowingType | undefined,
  items: FollowingType[] | undefined,
  remove: (uid: string) => void,
  addOrUpdate: (value: FollowingType) => void,
  loadData: (data: FollowingType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const FollowingsContext = createContext<FollowingContextType>({
  item: undefined,
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FollowingType) => { console.log('add or update', value) },
  loadData: (data: FollowingType[]) => { console.log('load data', data) },
  reset: () => {},
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const FollowingsProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, remove, addOrUpdate, loadData, reset, clear} = useStorage<FollowingType>(`followings`, FOLLOWINGS);

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
      <FollowingsContext.Provider value={ memoedValue }>
          { children }
      </FollowingsContext.Provider>
  )
}

export const useFollowings = (): FollowingContextType => useContext(FollowingsContext)

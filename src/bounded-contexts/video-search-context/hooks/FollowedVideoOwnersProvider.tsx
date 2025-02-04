'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import followedVideoOwners from '@/data/followed-owners';
import { FollowedVideoOwnerType } from '../domain/model/anime';


const LOWEST_ORDER = Number.MAX_VALUE;

const FOLLOWINGS: FollowedVideoOwnerType[] = [
    ...followedVideoOwners,
]
// .reduce<FollowedVideoOwnerType[]>((acc, curr) => acc.some(item => item.owner === curr.owner) ? acc : [...acc, curr], [])
.sort((a: FollowedVideoOwnerType, b: FollowedVideoOwnerType) => (a.order ?? LOWEST_ORDER) - (b.order ?? LOWEST_ORDER));


export interface FollowedVideoOwnersContextType {
  item: FollowedVideoOwnerType | undefined,
  items: FollowedVideoOwnerType[] | undefined,
  remove: (uid: string) => void,
  addOrUpdate: (value: FollowedVideoOwnerType) => void,
  loadData: (data: FollowedVideoOwnerType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const FollowedVideoOwnersContext = createContext<FollowedVideoOwnersContextType>({
  item: undefined,
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FollowedVideoOwnerType) => { console.log('add or update', value) },
  loadData: (data: FollowedVideoOwnerType[]) => { console.log('load data', data) },
  reset: () => {},
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const FollowedVideoOwnersProvider = ({ children }: Props): React.ReactElement => {

  const {item, items, remove, addOrUpdate, loadData, reset, clear} = useStorage<FollowedVideoOwnerType>(`followed-video-owners`, FOLLOWINGS);

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
      <FollowedVideoOwnersContext.Provider value={ memoedValue }>
          { children }
      </FollowedVideoOwnersContext.Provider>
  )
}

export const useFollowedVideoOwners = (): FollowedVideoOwnersContextType => useContext(FollowedVideoOwnersContext)

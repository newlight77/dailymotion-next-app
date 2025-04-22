'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { FollowedVideoOwnerType } from '../domain';
import { useFollowedVideoAnimesDrivenAdapter } from '../driven/FollowedVideoOwnersDrivenAdapter';
import { followedVideoOwnersDriverAdapter } from '../driver/FollowedVideoOwnersDriverAdapter';
import { followedVideoOwnersUsecase } from '../domain/usecases';


export interface FollowedVideoOwnersContextType {
  items: FollowedVideoOwnerType[] | undefined,
  remove: (uid: string) => void,
  addOrUpdate: (value: FollowedVideoOwnerType) => void,
  load: (animes: FollowedVideoOwnerType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const FollowedVideoOwnersContext = createContext<FollowedVideoOwnersContextType>({
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FollowedVideoOwnerType) => { console.log('add or update', value) },
  load: (animes: FollowedVideoOwnerType[]) => { console.log('load', animes) },
  reset: () => {},
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const FollowedVideoOwnersConfigurator = ({ children }: Props): React.ReactElement => {

  // manage dependencies injection
  const driven = useFollowedVideoAnimesDrivenAdapter()
  const driver = followedVideoOwnersDriverAdapter(followedVideoOwnersUsecase(driven))

  return (
      <FollowedVideoOwnersContext.Provider value={{
        items: driver.items(),
        remove: driver.remove,
        addOrUpdate: driver.addOrUpdate,
        load: driver.load,
        reset: driver.reset,
        clear: driver.clear,
      }}>
          { children }
      </FollowedVideoOwnersContext.Provider>
  )
}

export const useFollowedVideoOwners = (): FollowedVideoOwnersContextType => useContext(FollowedVideoOwnersContext)

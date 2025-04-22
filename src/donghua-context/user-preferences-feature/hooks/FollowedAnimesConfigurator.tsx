'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { FollowedAnimeType } from '../domain';
import { useFollowedAnimesDrivenAdapter } from '../driven/FollowedAnimesDrivenAdapter';
import { followedAnimesUsecase } from '../domain/usecases';
import { followedAnimesDriverAdapter } from '../driver/FollowedAnimesDriverAdapter';


export interface FollowedAnimesContextType {
  items: FollowedAnimeType[] | undefined,
  remove: (uid: string) => void,
  addOrUpdate: (value: FollowedAnimeType) => void,
  load:  (value: FollowedAnimeType[]) => void,
  clear: () => void
}

export const FollowedAnimesContext = createContext<FollowedAnimesContextType>({
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FollowedAnimeType) => { console.log('add or update', value) },
  load:  (value: FollowedAnimeType[]) => { console.log('load', value) },
  clear: () => {}
});


type Props = {
  children: React.ReactNode
}

export const FollowedAnimesConfigurator = ({ children }: Props): React.ReactElement => {

  // manage dependencies injection
  const driven = useFollowedAnimesDrivenAdapter()
  const driver = followedAnimesDriverAdapter(followedAnimesUsecase(driven))

  return (
      <FollowedAnimesContext.Provider value={{
        items: driver.items(),
        remove: driver.remove,
        addOrUpdate: driver.addOrUpdate,
        load: driver.load,
        clear: driver.clear

      }}>
          { children }
      </FollowedAnimesContext.Provider>
  )
}

export const useFollowedAnimes = (): FollowedAnimesContextType => useContext(FollowedAnimesContext)

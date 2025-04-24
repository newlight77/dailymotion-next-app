'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { AnimeType } from '../domain';
import { animeListUsecase } from '../domain';
import { animeListDriverAdapter } from '../driver';
import { animeListDrivenAdapter } from '../driven';



interface AnimelistContextType {
  findById: (uid: string) => Promise<AnimeType | undefined>,
  upsert: (value: AnimeType) => void,
  items: AnimeType[] | undefined,
  load: (data: AnimeType[]) => void,
  reset: () => void,
}
const AnimelistContext = createContext<AnimelistContextType>({
  findById: async (uid: string): Promise<AnimeType | undefined> => { console.log('find by id', uid); return undefined },
  upsert: (value: AnimeType) => { console.log('add data', value) },
  items: undefined,
  load: (data: AnimeType[]) => { console.log('load data', data) },
  reset: () => {},
});


type Props = {
  children: React.ReactNode
}

export const AnimeListConfigurator = ({ children }: Props): React.ReactElement => {

  // manage dependencies injection
  const driven = animeListDrivenAdapter()
  const driver = animeListDriverAdapter(animeListUsecase(driven))

  return (
      <AnimelistContext.Provider value={{
        findById: driver.findById,
        upsert: driver.upsert,
        items: driver.items(),
        load: driver.load,
        reset: driver.reset
      }}>
          { children }
      </AnimelistContext.Provider>
  )
}

export const useAnimelist = (): AnimelistContextType => useContext(AnimelistContext)

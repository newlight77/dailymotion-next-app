'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { animeListQuery, AnimeType } from '../domain';
import { animeListUsecase } from '../domain';
import { animeListDriverAdapter } from '../driver';
import { animeListDrivenAdapter } from '../driven';



interface AnimelistContextType {
  findById: (uid: string) => Promise<AnimeType | undefined>,
  items: AnimeType[] | undefined,
  upsert: (value: AnimeType) => void,
  load: (data: AnimeType[]) => void,
  reset: () => void,
}
const AnimelistContext = createContext<AnimelistContextType>({
  findById: async (uid: string): Promise<AnimeType | undefined> => { console.log('find by id', uid); return undefined },
  items: undefined,
  upsert: (value: AnimeType) => { console.log('add data', value) },
  load: (data: AnimeType[]) => { console.log('load data', data) },
  reset: () => {},
});


type Props = {
  children: React.ReactNode
}

export const AnimeListConfigurator = ({ children }: Props): React.ReactElement => {

  // manage dependencies injection
  const driven = animeListDrivenAdapter()
  const driver = animeListDriverAdapter(animeListUsecase(driven), animeListQuery(driven))

  return (
      <AnimelistContext.Provider value={{
        findById: driver.findById,
        items: driver.items(),
        upsert: driver.upsert,
        load: driver.load,
        reset: driver.reset
      }}>
          { children }
      </AnimelistContext.Provider>
  )
}

export const useAnimelist = (): AnimelistContextType => useContext(AnimelistContext)

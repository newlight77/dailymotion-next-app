'use client'
import React, { useContext, useEffect, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import { AnimeType } from '../domain/model/anime';
import { AnimeListPort } from '@/bounded-contexts/video-search-context/domain/usecases/animelist-usecase';



interface AnimelistContextType {
  adapter: AnimeListPort,
  items: AnimeType[] | undefined,
  loadData: (data: AnimeType[]) => void,
  reset: () => void,
}

const AnimelistContext = createContext<AnimelistContextType>({
  adapter: {} as AnimeListPort,
  items: [],
  loadData: (data: AnimeType[]) => { console.log('load data', data) },
  reset: () => {},
});


type Props = {
  adapter: AnimeListPort,
  children: React.ReactNode
}

export const AnimeListProvider = ({ adapter, children }: Props): React.ReactElement => {

  const {items, loadData} = useStorage<AnimeType>(`animelist`, []);

  useEffect(() => {
    reset();
  }, [adapter])

  const reset = async () => {
    console.log('AnimeListProvider useEffect, fetchData');
    const all = await adapter.findAll();
    loadData(all);
  }

  const memoedValue = useMemo(
    () => ({
      adapter,
      items,
      loadData,
      reset,
    }),
    [items, loadData, reset, reset]
  );

  return (
      <AnimelistContext.Provider value={ memoedValue }>
          { children }
      </AnimelistContext.Provider>
  )
}

export const useAnimelist = (): AnimelistContextType => useContext(AnimelistContext)

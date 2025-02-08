'use client'
import React, { useContext, useEffect, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import { AnimeType } from '../domain/model/anime';
import { AnimeListPort, AnimeListUsecase, AnimeListUsecasePort } from '../domain/usecases/animelist-usecase';



interface AnimelistContextType {
  usecase: AnimeListUsecasePort,
  items: AnimeType[] | undefined,
  loadData: (data: AnimeType[]) => void,
  upsert: (value: AnimeType) => void,
  reset: () => void,
}

const AnimelistContext = createContext<AnimelistContextType>({
  usecase: {} as AnimeListUsecasePort,
  items: [],
  loadData: (data: AnimeType[]) => { console.log('load data', data) },
  upsert: (value: AnimeType) => { console.log('add data', value) },
  reset: () => {},
});


type Props = {
  adapter: AnimeListPort,
  children: React.ReactNode
}

export const AnimeListProvider = ({ adapter, children }: Props): React.ReactElement => {

  const usecase = AnimeListUsecase(adapter)

  const {items, loadData, addOrUpdate} = useStorage<AnimeType>(`animelist`, []);

  useEffect(() => {
    // required to update the storage to refresh UI
    // reset();
  }, [usecase])

  const reset = async () => {
    const all = await usecase.findAll();
    // console.log('AnimeListProvider reset', all);
    loadData(all);
  }

  const upsert = async (anime: AnimeType) => {
    // console.log('AnimeListProvider before upsert', anime);
    const result = await usecase.upsert(anime);
    if (!result) {
      console.error('failed to upsert anime', anime)
      return
    }
    addOrUpdate(anime)
    // console.log('AnimeListProvider post upsert', items)
  }

  const memoedValue = useMemo(
    () => ({
      usecase,
      items,
      loadData,
      upsert,
      reset,
    }),
    [usecase, items, loadData, reset, reset]
  );

  return (
      <AnimelistContext.Provider value={ memoedValue }>
          { children }
      </AnimelistContext.Provider>
  )
}

export const useAnimelist = (): AnimelistContextType => useContext(AnimelistContext)

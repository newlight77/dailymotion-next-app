'use client'
import React, { useContext, useMemo } from 'react';
import { createContext } from "react";
import { useStorage } from '@/shared/useStorage';
import { FavoriteType } from '../domain';
import { favoritesDrivenAdapter } from '../driven/FavoritesDrivenAdapter';
import { favoriteUsecase } from '../domain/usecases';
import { favoritesDriverAdapter } from '../driver/FavoritesDriverAdapter';


export interface FavoriteContextType {
  // item: FavoriteType | undefined,
  items: FavoriteType[],
  remove: (uid: string) => void,
  addOrUpdate: (value: FavoriteType) => void,
  // loadData: (data: FavoriteType[]) => void,
  // reset: () => void,
  // clear: () => void,
}

export const FavoritesContext = createContext<FavoriteContextType>({
  // item: undefined,
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FavoriteType) => { console.log('add or update', value) },
  // loadData: (data: FavoriteType[]) => { console.log('load data', data) },
  // reset: () => {},
  // clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const FavoritesConfigurator = ({ children }: Props): React.ReactElement => {

  const driven = favoritesDrivenAdapter()
  const driver = favoritesDriverAdapter(favoriteUsecase(driven))

  // const {item, items, remove, addOrUpdate, loadData, reset, clear} = useStorage<FavoriteType>(`favorites`, []);

  // const memoedValue = useMemo(
    // () => ({
      // ...driver
    // }),
    // [item, items, addOrUpdate, loadData, reset, reset, clear]
  // );
  return (
      <FavoritesContext.Provider value={{
          items: driver.items(),
          remove: driver.remove,
          addOrUpdate: driver.addOrUpdate
      }}>
          { children }
      </FavoritesContext.Provider>
  )
}

export const useFavorites = (): FavoriteContextType => useContext(FavoritesContext)

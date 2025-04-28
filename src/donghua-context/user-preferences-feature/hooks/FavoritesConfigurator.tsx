'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { FavoriteType } from '../domain';
import { useFavoritesDrivenAdapter } from '../driven/FavoritesDrivenAdapter';
import { favoriteQuery, favoriteUsecase } from '../domain/usecases';
import { favoritesDriverAdapter } from '../driver/FavoritesDriverAdapter';


export interface FavoriteContextType {
  items: FavoriteType[],
  remove: (uid: string) => void,
  addOrUpdate: (value: FavoriteType) => void,
  load: (fav: FavoriteType[]) => void,
  reset: () => void,
  clear: () => void
}

export const FavoritesContext = createContext<FavoriteContextType>({
  items: [],
  remove: (uid: string) => { console.log('remove', uid) },
  addOrUpdate: (value: FavoriteType) => { console.log('add or update', value) },
  load: (fav: FavoriteType[]) => { console.log('load', fav)},
  reset: () => {},
  clear: () => {}
});


type Props = {
  children: React.ReactNode
}

export const FavoritesConfigurator = ({ children }: Props): React.ReactElement => {

  // manage dependencies injection
  const driven = useFavoritesDrivenAdapter()
  const driver = favoritesDriverAdapter(favoriteUsecase(driven), favoriteQuery(driven))

  return (
      <FavoritesContext.Provider value={{
          items: driver.items(),
          remove: driver.remove,
          addOrUpdate: driver.addOrUpdate,
          load: driver.load,
          reset: driver.reset,
          clear: driver.clear
      }}>
          { children }
      </FavoritesContext.Provider>
  )
}


// here the configurator and context are the same
export const useFavorites = (): FavoriteContextType => useContext(FavoritesContext)

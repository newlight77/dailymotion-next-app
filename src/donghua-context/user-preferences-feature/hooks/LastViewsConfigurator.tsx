'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { LastViewType } from '../domain';
import { useLastViewsDrivenAdapter } from '../driven/LastViewsDrivenAdapter';
import { lastViewsDriverAdapter } from '../driver/LastViewsDriverAdapter';
import { lastViewsUsecase } from '../domain/usecases';


export interface LastViewContextType {
  items: LastViewType[] | undefined,
  addOrUpdate : (lastView: LastViewType) => void,
  remove: (uid: string) => void,
  clear: () => void,
}

export const LastViewsContext = createContext<LastViewContextType>({
  items: [],
  addOrUpdate : (lastView: LastViewType) => { console.log('addOrUpdate', lastView) },
  remove: (uid: string) => { console.log('remove', uid) },
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const LastViewsConfigurator = ({ children }: Props): React.ReactElement => {

  // manage dependencies injection
  const driven = useLastViewsDrivenAdapter()
  const driver = lastViewsDriverAdapter(lastViewsUsecase(driven))

  return (
      <LastViewsContext.Provider value={{
        items: driver.items(),
        addOrUpdate: driver.addOrUpdate,
        remove: driver.remove,
        clear: driver.clear
      }}>
          { children }
      </LastViewsContext.Provider>
  )
}

export const useLastViews = (): LastViewContextType => useContext(LastViewsContext)

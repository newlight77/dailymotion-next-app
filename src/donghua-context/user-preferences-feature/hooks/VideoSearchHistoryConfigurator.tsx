'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { SearchKeywordsType } from '../domain';
import { useVideoSearchHistoryDrivenAdapter } from '../driven/VideoSearchHistoryDrivenAdapter';
import { videoSearchHistoryUsecase } from '../domain/usecases';
import { videoSearchHistoryDriverAdapter } from '../driver/VideoSearchHistoryDriverAdapter';


export interface VideoSearchHistoryContextType {
  items: SearchKeywordsType[] | undefined,
  addOrUpdate : (keywords: SearchKeywordsType) => void,
  remove: (uid: string) => void,
  clear: () => void,
}

export const VideoSearchHistoryContext = createContext<VideoSearchHistoryContextType>({
  items: [],
  addOrUpdate : (keywords: SearchKeywordsType) => { console.log('addOrUpdate', keywords) },
  remove: (uid: string) => { console.log('remove', uid) },
  clear: () => {},
});


type Props = {
  children: React.ReactNode
}

export const VideoSearchHistoryConfigurator = ({ children }: Props): React.ReactElement => {

  // manage dependencies injection
  const driven = useVideoSearchHistoryDrivenAdapter()
  const driver = videoSearchHistoryDriverAdapter(videoSearchHistoryUsecase(driven))
  return (
      <VideoSearchHistoryContext.Provider value={{
        items: driver.items(),
        addOrUpdate: driven.addOrUpdate,
        remove: driver.remove,
        clear: driver.clear
      }}>
          { children }
      </VideoSearchHistoryContext.Provider>
  )
}

export const useVideoSearchHistory = (): VideoSearchHistoryContextType => useContext(VideoSearchHistoryContext)

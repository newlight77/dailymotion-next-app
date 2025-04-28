'use client'
import React, { useContext, useState } from 'react';
import { createContext } from "react";
import { MetaVideoType, VideoType, PreferencesType, videoSearchQuery } from '../domain';
import { videoSearchUsecase, VideoSearchWithScoreResponse, VideoWithScoreType } from '../domain';
import { videoSearchDrivenReadAdapter, videoSearchDrivenWriteAdapter } from '../driven';
import { videoSearchDriverAdapter } from '../driver';


export interface VideoSearchContextType {
  searchResults: MetaVideoType[] | undefined,
  search: (keywords: string, prefs: PreferencesType) => void,
  findById: (id: string) => Promise<VideoType | undefined>,
}

export const VideoSearchContext = createContext<VideoSearchContextType>({
  searchResults: [],
  search: (keywords: string, prefs: PreferencesType) : VideoWithScoreType[] => { console.log('search with prefs', keywords, prefs); return [] },
  findById: async (id: string) => { console.log('findById', id); return undefined },
})


type Props = {
  children: React.ReactNode
}

export const VideoSearchConfigurator = ({ children }: Props): React.ReactElement => {

  const readDriven = videoSearchDrivenReadAdapter()
  const writeDriven = videoSearchDrivenWriteAdapter()
  const driver = videoSearchDriverAdapter(videoSearchUsecase(readDriven, writeDriven), videoSearchQuery(readDriven))

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchResults, setSearchResults] = useState<VideoWithScoreType[]>([]);

  const search = async (keywords: string, prefs: PreferencesType) => {
    const params = {
        search: keywords,
        limit: limit,
        page: page
    }

    const response: VideoSearchWithScoreResponse = await driver.search(params, prefs);
    console.log('VideoSearchConfigurator adapter.search', response);

    // TODO : do I have the title and last episode here so I can update the anime

    setSearchResults(response.list || []);
    setPage(response.page || 1)
    setLimit(response.limit || 50)
  }

  return (
      <VideoSearchContext.Provider value={{
        searchResults,
        search,
        findById: driver.getById
      }}>
          { children }
      </VideoSearchContext.Provider>
  )
}

export const useSearchVideos = (): VideoSearchContextType => useContext(VideoSearchContext)

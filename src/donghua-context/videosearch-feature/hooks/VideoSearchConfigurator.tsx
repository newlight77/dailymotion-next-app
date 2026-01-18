'use client'
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { createContext } from "react";
import { MetaVideoType, VideoType, PreferencesType, videoSearchQuery } from '../domain';
import { videoSearchUsecase, VideoSearchWithScoreResponse, VideoWithScoreType } from '../domain';
import { videoSearchDrivenAdapter } from '../driven';
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
  const driven = useMemo(() => videoSearchDrivenAdapter(), [])
  const driver = useMemo(
    () => videoSearchDriverAdapter(videoSearchUsecase(driven), videoSearchQuery(driven)),
    [driven]
  )

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchResults, setSearchResults] = useState<VideoWithScoreType[]>([]);

  const search = useCallback(async (keywords: string, prefs: PreferencesType) => {
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
  }, [driver, limit, page])

  const contextValue = useMemo(() => ({
    searchResults,
    search,
    findById: driver.getById
  }), [searchResults, search, driver])

  return (
      <VideoSearchContext.Provider value={contextValue}>
          { children }
      </VideoSearchContext.Provider>
  )
}

export const useSearchVideos = (): VideoSearchContextType => useContext(VideoSearchContext)

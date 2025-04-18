'use client'
import React, { useContext, useMemo, useState } from 'react';
import { createContext } from "react";
import { MetaVideoType, VideoType, PreferencesType } from '../domain';
import { VideoSearchPort, VideoSearchUsecase, VideoSearchWithScoreResponse, VideoWithScoreType } from '../domain';


export interface VideoSearchContextType {
  found: VideoType | undefined,
  searchResults: MetaVideoType[] | undefined,
  search: (keywords: string, prefs: PreferencesType) => void,
  findById: (id: string) => Promise<VideoType | undefined>,
}

export const VideoSearchContext = createContext<VideoSearchContextType>({
  found: undefined,
  searchResults: [],
  search: (keywords: string, prefs: PreferencesType) : VideoWithScoreType[] => { console.log('search with prefs', keywords, prefs); return [] },
  findById: async (id: string) => { console.log('findById', id); return undefined },
})


type Props = {
  videoSearchAdapter: VideoSearchPort,
  children: React.ReactNode
}

export const VideoSearchConfigurator = ({ videoSearchAdapter, children }: Props): React.ReactElement => {

  const usecase = VideoSearchUsecase(videoSearchAdapter)

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [found, setFound] = useState<VideoType>();
  const [searchResults, setSearchResults] = useState<VideoWithScoreType[]>([]);

  const search = async (keywords: string, prefs: PreferencesType) => {
    const params = {
        search: keywords,
        limit: limit,
        page: page
    }

    const response: VideoSearchWithScoreResponse = await usecase.search(params, prefs);
    console.log('VideoSearchConfigurator adapter.search', response);

    // TODO : do I have the title and last episode here so I can update the anime

    setSearchResults(response.list || []);
    setPage(response.page || 1)
    setLimit(response.limit || 50)
  }

  const findById = async (id: string): Promise<VideoType | undefined> => {
    const result: VideoType | undefined = await usecase.getById(id)

    console.log('on success', result);
    if (result) {
      setFound(result);
    }

    return result;
  }

  const memoedValue = useMemo(
    () => ({
      searchResults,
      search,
      found,
      findById
    }),
    [found, searchResults, search, findById]
  );

  return (
      <VideoSearchContext.Provider value={ memoedValue }>
          { children }
      </VideoSearchContext.Provider>
  )
}

export const useSearchVideos = (): VideoSearchContextType => useContext(VideoSearchContext)

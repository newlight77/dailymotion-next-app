'use client'
import React, { useContext, useMemo, useState } from 'react';
import { createContext } from "react";
import { MetaVideoType, VideoType } from '../domain/model/anime';
import { VideoSearchResponse, VideoSearchPort } from '../domain/usecases/video-search-usecase';


export interface VideoSearchContextType {
  found: VideoType | undefined,
  searchResults: MetaVideoType[] | undefined,
  search: (keywords: string) => void,
  findById: (value: string) => void,
}

export const VideoSearchContext = createContext<VideoSearchContextType>({
  found: undefined,
  searchResults: [],
  search: (keywords: string) : MetaVideoType[] => { console.log('remove', keywords); return [] },
  findById: (value: string) => { console.log('add or update', value) },
})


type Props = {
  adapter: VideoSearchPort,
  children: React.ReactNode
}

export const VideoSearchProvider = ({ adapter, children }: Props): React.ReactElement => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [found, setFound] = useState<VideoType>();
  const [searchResults, setSearchResults] = useState<MetaVideoType[]>([]);

  const search = async (keywords: string) => {
    const params = {
        search: keywords,
        limit: limit,
        page: page
    }

    const response: VideoSearchResponse = await adapter.search(params);
    console.log('VideoSearchProvider adapter.search', response);

    setSearchResults(response.list || []);
    setPage(response.page || 1)
    setLimit(response.limit || 30)
  }

  const findById = async (id: string): Promise<VideoType | undefined> => {
    const result: VideoType | undefined = await adapter.getById(id)

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

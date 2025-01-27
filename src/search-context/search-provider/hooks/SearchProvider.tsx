'use client'
import React, { useContext, useMemo, useState } from 'react';
import { createContext } from "react";
import { MetaVideoType, VideoType } from '../domain/anime';
import { SearchResponse, searchVideos } from '../adapter/searchVideo-adapter';
import { getVideo } from '../adapter/getVideo-adapter';


export interface SearchContextType {
  found: VideoType | undefined,
  searchResults: MetaVideoType[] | undefined,
  search: (keywords: string) => void,
  findById: (value: string) => void,
}

export const SearchContext = createContext<SearchContextType>({
  found: undefined,
  searchResults: [],
  search: (keywords: string) : MetaVideoType[] => { console.log('remove', keywords); return [] },
  findById: (value: string) => { console.log('add or update', value) },
})


type Props = {
  children: React.ReactNode
}

export const SearchHistoryProvider = ({ children }: Props): React.ReactElement => {
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

    const response: SearchResponse = await searchVideos(params);

    setSearchResults(response.list || []);
    setPage(response.page || 1)
    setLimit(response.limit || 30)
  }

  const findById = async (id: string) => {
    const result: VideoType | undefined = await getVideo(id)

    console.log('on success', result);
    if (result) {
      setFound(result);
    }
  }

  const memoedValue = useMemo(
    () => ({
      found,
      searchResults,
      search,
      findById
    }),
    [found, searchResults, search, findById]
  );

  return (
      <SearchContext.Provider value={ memoedValue }>
          { children }
      </SearchContext.Provider>
  )
}

export const useSearchHistory = (): SearchContextType => useContext(SearchContext)

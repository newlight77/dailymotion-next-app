'use client'
import React from 'react';
import { FavoritesProvider } from '../hooks/FavoritesProvider';
import { FollowingsProvider } from '../hooks/FollowingsProvider';
import { LastViewsProvider } from '../hooks/LastViewsProvider';
import { SearchHistoryProvider } from '../hooks/SearchHistoryProvider';
import { AnimeListProvider } from '../hooks/AnimeListProvider';
import { VideoSearchProvider } from '../hooks/VideoSearchProvider';
import animeListAdapter from '../adapter/getAnime-adapter';
import videoSearchAdapter from '../adapter/video-search-adapter';


type Props = {
  children: React.ReactNode
}

export const SearchProvider = ({ children }: Props): React.ReactElement => {

  return (
    <VideoSearchProvider adapter={videoSearchAdapter}>
      <SearchHistoryProvider>
        <LastViewsProvider>
          <FollowingsProvider>
            <FavoritesProvider>
              <AnimeListProvider adapter={animeListAdapter}>
                {children}
              </AnimeListProvider>
            </FavoritesProvider>
          </FollowingsProvider>
        </LastViewsProvider>
      </SearchHistoryProvider>
    </VideoSearchProvider>
  )
}
'use client'
import React from 'react';
import { FavoritesProvider } from '../hooks';
import { FollowingsProvider } from '../hooks';
import { LastViewsProvider } from '../hooks';
import { SearchHistoryProvider } from '../hooks';
import { AnimeListProvider } from '../hooks';
import { VideoSearchProvider } from '../hooks';
import animeListAdapter from '../adapter/animelist-adapter';
import videoSearchAdapter from '../adapter/video-search-adapter';


type Props = {
  children: React.ReactNode
}

export const SearchModule = ({ children }: Props): React.ReactElement => {

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
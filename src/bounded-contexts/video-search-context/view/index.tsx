'use client'
import React from 'react';
import { FavoritesProvider } from '../hooks';
import { FollowedVideoOwnersProvider } from '../hooks';
import { LastViewsProvider } from '../hooks';
import { VideoSearchHistoryProvider } from '../hooks';
import { AnimeListProvider } from '../hooks';
import { VideoSearchProvider } from '../hooks';
import animeListAdapter from '../adapter/animelist-adapter';
import videoSearchAdapter from '../adapter/videosearch-adapter';
import { FollowedAnimesProvider } from '../hooks/FollowedAnimesProvider';


type Props = {
  children: React.ReactNode
}

export const SearchModule = ({ children }: Props): React.ReactElement => {

  return (
    <VideoSearchProvider adapter={videoSearchAdapter}>
      <VideoSearchHistoryProvider>
        <LastViewsProvider>
          <FollowedAnimesProvider>
          <FollowedVideoOwnersProvider>
            <FavoritesProvider>
              <AnimeListProvider adapter={animeListAdapter}>
                {children}
              </AnimeListProvider>
            </FavoritesProvider>
          </FollowedVideoOwnersProvider>
          </FollowedAnimesProvider>
        </LastViewsProvider>
      </VideoSearchHistoryProvider>
    </VideoSearchProvider>
  )
}
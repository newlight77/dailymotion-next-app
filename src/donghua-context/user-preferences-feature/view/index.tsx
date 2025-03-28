'use client'
import React from 'react';
import { FavoritesProvider } from '../hooks';
import { FollowedVideoOwnersProvider } from '../hooks';
import { LastViewsProvider } from '../hooks';
import { VideoSearchHistoryProvider } from '../hooks';
import { FollowedAnimesProvider } from '../hooks';


type Props = {
  children: React.ReactNode
}

export const UserPreferenceshModule = ({ children }: Props): React.ReactElement => {

  return (
      <VideoSearchHistoryProvider>
        <LastViewsProvider>
          <FollowedAnimesProvider>
          <FollowedVideoOwnersProvider>
            <FavoritesProvider>
                {children}
            </FavoritesProvider>
          </FollowedVideoOwnersProvider>
          </FollowedAnimesProvider>
        </LastViewsProvider>
      </VideoSearchHistoryProvider>
  )
}

export * from './favorites/Favorites'
export * from './followings/FollowedAnimes'
export * from './followings/FollowedOwners'
export * from './lastviews/LastViews'
export * from './searchhistory/VideoSearchHistory'

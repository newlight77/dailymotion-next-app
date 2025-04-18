'use client'
import React from 'react';
import { FavoritesConfigurator } from '../hooks';
import { FollowedVideoOwnersConfigurator } from '../hooks';
import { LastViewsConfigurator } from '../hooks';
import { VideoSearchHistoryConfigurator } from '../hooks';
import { FollowedAnimesConfigurator } from '../hooks';


type Props = {
  children: React.ReactNode
}

export const UserPreferenceshModule = ({ children }: Props): React.ReactElement => {

  return (
      <VideoSearchHistoryConfigurator>
        <LastViewsConfigurator>
          <FollowedAnimesConfigurator>
          <FollowedVideoOwnersConfigurator>
            <FavoritesConfigurator>
                {children}
            </FavoritesConfigurator>
          </FollowedVideoOwnersConfigurator>
          </FollowedAnimesConfigurator>
        </LastViewsConfigurator>
      </VideoSearchHistoryConfigurator>
  )
}

export * from './favorites/Favorites'
export * from './followings/FollowedAnimes'
export * from './followings/FollowedOwners'
export * from './lastviews/LastViews'
export * from './searchhistory/VideoSearchHistory'

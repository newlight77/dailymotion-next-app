'use client'
import React from 'react';
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
                {children}
          </FollowedVideoOwnersConfigurator>
          </FollowedAnimesConfigurator>
        </LastViewsConfigurator>
      </VideoSearchHistoryConfigurator>
  )
}

export * from './followings/FollowedAnimes'
export * from './followings/FollowedOwners'
export * from './lastviews/LastViews'
export * from './searchhistory/VideoSearchHistory'

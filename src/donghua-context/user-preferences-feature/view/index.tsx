'use client'
import React from 'react';
import { FollowedVideoOwnersConfigurator } from '../hooks';
import { LastViewsConfigurator } from '../hooks';
import { VideoSearchHistoryConfigurator } from '../hooks';
import { FollowedAnimesConfigurator } from '../hooks';
import { WatchListsConfigurator } from '../hooks';


type Props = {
  children: React.ReactNode
}

export const UserPreferenceshModule = ({ children }: Props): React.ReactElement => {

  return (
      <VideoSearchHistoryConfigurator>
        <LastViewsConfigurator>
          <FollowedAnimesConfigurator>
            <WatchListsConfigurator>
              <FollowedVideoOwnersConfigurator>
                    {children}
              </FollowedVideoOwnersConfigurator>
            </WatchListsConfigurator>
          </FollowedAnimesConfigurator>
        </LastViewsConfigurator>
      </VideoSearchHistoryConfigurator>
  )
}

export * from './followings/FollowedAnimes'
export * from './followings/FollowedOwners'
export * from './lastviews/LastViews'
export * from './searchhistory/VideoSearchHistory'
export * from './watchlists/WatchLists'
export * from './watchlists/WatchListDetail'

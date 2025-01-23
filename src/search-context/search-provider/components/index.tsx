'use client'
import React from 'react';
import { FavoritesProvider } from './favorites/FavoritesProvider';
import { FollowingsProvider } from './followings/FollowingsProvider';
import { LastViewsProvider } from './lastviews/LastViewsProvider';
import { SearchHistoryProvider } from './search/SearchHistoryProvider';


type Props = {
  children: React.ReactNode
}

export const SearchProvider = ({ children }: Props): React.ReactElement => {

  return (
    <SearchHistoryProvider>
      <LastViewsProvider>
        <FollowingsProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </FollowingsProvider>
      </LastViewsProvider>
    </SearchHistoryProvider>
  )
}
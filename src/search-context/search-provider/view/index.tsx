'use client'
import React from 'react';
import { FavoritesProvider } from '../domain/FavoritesProvider';
import { FollowingsProvider } from '../domain/FollowingsProvider';
import { LastViewsProvider } from '../domain/LastViewsProvider';
import { SearchHistoryProvider } from '../domain/SearchHistoryProvider';


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
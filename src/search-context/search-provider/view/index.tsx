'use client'
import React from 'react';
import { FavoritesProvider } from '../hooks/FavoritesProvider';
import { FollowingsProvider } from '../hooks/FollowingsProvider';
import { LastViewsProvider } from '../hooks/LastViewsProvider';
import { SearchHistoryProvider } from '../hooks/SearchHistoryProvider';
import { AnimeListProvider } from '../hooks/AnimeListProvider';


type Props = {
  children: React.ReactNode
}

export const SearchProvider = ({ children }: Props): React.ReactElement => {

  return (
    <SearchHistoryProvider>
      <LastViewsProvider>
        <FollowingsProvider>
          <FavoritesProvider>
            <AnimeListProvider>
              {children}
            </AnimeListProvider>
          </FavoritesProvider>
        </FollowingsProvider>
      </LastViewsProvider>
    </SearchHistoryProvider>
  )
}
'use client'
import React from 'react';
import { FavoritesProvider } from '../hooks/FavoritesProvider';
import { FollowingsProvider } from '../hooks/FollowingsProvider';
import { LastViewsProvider } from '../hooks/LastViewsProvider';
import { SearchHistoryProvider } from '../hooks/SearchHistoryProvider';
import { AnimeListProvider } from '../hooks/AnimeListProvider';
import { SearchVideoProvider } from '../hooks/SearchProvider';


type Props = {
  children: React.ReactNode
}

export const SearchProvider = ({ children }: Props): React.ReactElement => {

  return (
    <SearchVideoProvider>
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
    </SearchVideoProvider>
  )
}
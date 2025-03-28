'use client'
import React from 'react';
import { AnimeListProvider } from '../hooks';
import { animeListAdapter } from '../adapter';


type Props = {
  children: React.ReactNode
}

export const AnimeListModule = ({ children }: Props): React.ReactElement => {

  return (
    <AnimeListProvider animeListAdapter={animeListAdapter}>
      {children}
    </AnimeListProvider>
  )
}

export * from './animelist/AnimeCard'
export * from './animelist/AnimeDetail'
export * from './animelist/AnimeEdit'
export * from './animelist/AnimeList'

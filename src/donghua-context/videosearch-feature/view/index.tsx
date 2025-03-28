'use client'
import React from 'react';
import { videoSearchAdapter } from '../adapter';
import { VideoSearchProvider } from '../hooks';


type Props = {
  children: React.ReactNode
}

export const SearchModule = ({ children }: Props): React.ReactElement => {

  return (
    <VideoSearchProvider videoSearchAdapter={videoSearchAdapter}>
                {children}
    </VideoSearchProvider>
  )
}

export * from './videosearch/VideoCard'
export * from './videosearch/VideoList'
export * from './videosearch/VideoSearch'
export * from './videosearch/VideoSearchBar'

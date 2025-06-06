'use client'
import React from 'react';
import { VideoSearchConfigurator } from '../hooks';


type Props = {
  children: React.ReactNode
}

export const SearchModule = ({ children }: Props): React.ReactElement => {

  return (
    <VideoSearchConfigurator>
                {children}
    </VideoSearchConfigurator>
  )
}

export * from './videosearch/VideoCard'
export * from './videosearch/VideoList'
export * from './videosearch/VideoSearch'
export * from './videosearch/VideoSearchBar'

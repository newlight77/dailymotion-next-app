'use client'
import React from 'react';
import { UpcomingScheduleConfigurator } from '../hooks/UpcomingScheduleConfigurator';

type Props = {
  children: React.ReactNode
}

export const ScheduleModule = ({ children }: Props): React.ReactElement => {
  return (
    <UpcomingScheduleConfigurator>
      {children}
    </UpcomingScheduleConfigurator>
  )
}

export * from './schedule/UpcomingScheduleFeaturedRegion'
export * from './new-series/FeaturedNewSeriesRegion'

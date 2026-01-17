"use client"
import React from 'react';
import FeaturedRegion from '../../../../components/organisms/FeaturedRegion';
import { UpcomingScheduleFeaturedView } from './UpcomingScheduleFeaturedView';

interface Props {
  className?: string,
}

export const UpcomingScheduleFeaturedRegion: React.FC<Props> = ({ className }) => {
  return (
    <FeaturedRegion
      className={className}
      title="upcoming episodes"
      subtitle="Followed animes ordered by the nearest upcoming episode"
    >
      <UpcomingScheduleFeaturedView />
    </FeaturedRegion>
  )
}

"use client"
import React from 'react';
import FeaturedRegion from '../../../../components/organisms/FeaturedRegion';
import { FeaturedNewSeriesView } from './FeaturedNewSeriesView';

interface Props {
  className?: string,
}

export const FeaturedNewSeriesRegion: React.FC<Props> = ({ className }) => {
  return (
    <FeaturedRegion
      className={className}
      title="new series"
      subtitle="Recently published titles"
    >
      <FeaturedNewSeriesView />
    </FeaturedRegion>
  )
}

"use client"
import React, { useEffect, useState } from 'react';
import Panel from '../../../../components/molecules/Panel';
import { useIsMounted } from '@/shared/useIsMounted';
import { FeaturedNewSeriesCard } from './FeaturedNewSeriesCard';

type NewSeriesItem = {
  uid: string,
  title: string,
  originalTitle?: string,
  summary?: string,
  thumbnail?: string,
}

export const FeaturedNewSeriesView: React.FC = () => {
  const isMounted = useIsMounted();
  const [items, setItems] = useState<NewSeriesItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/new-series');
        const data = await res.json();
        setItems(data?.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    if (isMounted()) run();
  }, [isMounted]);

  if (!isMounted() || loading) {
    return (
      <Panel className="p-6">
        <div className="text-sm">Loading new series...</div>
      </Panel>
    );
  }

  if (!items.length) {
    return (
      <Panel className="p-6">
        <div className="text-sm">No new series found.</div>
      </Panel>
    );
  }

  const maxIndex = items.length - 1;
  const current = items[Math.min(index, maxIndex)];

  const handlePrev = () => setIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  const handleNext = () => setIndex(prev => (prev >= maxIndex ? 0 : prev + 1));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-3 px-2">
        <button className="rounded-md border px-3 py-1 text-xs" onClick={handlePrev}>
          prev
        </button>
        <button className="rounded-md border px-3 py-1 text-xs" onClick={handleNext}>
          next
        </button>
      </div>

      <div className="md:flex flex-wrap">
        <FeaturedNewSeriesCard
          anime={current}
          className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 3xl:w-1/6 4xl:w-1/7 5xl:w-1/8 min-w-80 h-auto"
        />
      </div>
    </div>
  )
}

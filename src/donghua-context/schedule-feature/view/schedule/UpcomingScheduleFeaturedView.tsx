"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { useFollowedAnimes } from '@/donghua-context/user-preferences-feature';
import { useAnimelist } from '@/donghua-context/animelist-feature';
import { useIsMounted } from '@/shared/useIsMounted';
import { useUpcomingSchedule } from '../../hooks/UpcomingScheduleConfigurator';
import { UpcomingEpisodeType } from '../../domain';
import Panel from '../../../../components/molecules/Panel';
import Pill from '../../../../components/atoms/Pill';
import { UpcomingScheduleCard } from './UpcomingScheduleCard';

const SOURCES = [
  'lucifer donghua',
  'bilibili',
  'youku',
  'animedonghua',
  'donghuazone',
  'donghuastream',
  'anime4i',
  'animecube live'
]

type ScheduleRow = {
  uid: string,
  animeId: string,
  title: string,
  subtitle?: string,
  originalTitle?: string,
  thumbnail?: string,
  lastEpisode?: number,
  lastPublishedAt?: Date,
  upcomingEpisode?: number | string,
  upcomingAt?: Date,
  source?: string,
  sourceUrl?: string,
  isEstimate?: boolean,
}

const weekdayMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

function parseUpdateDays(updateDays?: string): number[] {
  if (!updateDays) return [];
  return updateDays
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(Boolean)
    .map(d => weekdayMap[d])
    .filter(d => typeof d === 'number' && !Number.isNaN(d));
}

function getNextDateFromWeekdays(days: number[], from = new Date()): Date | undefined {
  if (!days.length) return undefined;
  const today = from.getDay();
  let bestOffset: number | undefined;
  for (const d of days) {
    const offset = (d - today + 7) % 7;
    if (bestOffset === undefined || offset < bestOffset) bestOffset = offset;
  }
  if (bestOffset === undefined) return undefined;
  const next = new Date(from);
  next.setHours(12, 0, 0, 0);
  next.setDate(from.getDate() + bestOffset);
  return next;
}

function toDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export const UpcomingScheduleFeaturedView: React.FC = () => {
  const isMounted = useIsMounted();
  const useFollowed = useFollowedAnimes();
  const useAnimes = useAnimelist();
  const schedule = useUpcomingSchedule();

  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const followed = useMemo(() => useFollowed.items || [], [useFollowed.items]);
  const requestItems = useMemo(() => {
    return followed.map(item => ({ title: item.title, originalTitle: item.originalTitle }));
  }, [followed]);

  useEffect(() => {
    const run = async () => {
      if (!followed.length) {
        setRows([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const upcoming = await schedule.fetchUpcomingEpisodes(requestItems);
        const byTitle = new Map<string, UpcomingEpisodeType>();
        upcoming.forEach(item => byTitle.set(item.title.toLowerCase(), item));

        const nextRows = followed.map(f => {
          const anime = useAnimes.items?.find(a => a.uid === f.animeId || a.title === f.title);
          const source = byTitle.get(f.title.toLowerCase());
          const estimatedDate = getNextDateFromWeekdays(parseUpdateDays(anime?.updateDays));
          const upcomingAt = toDate(source?.date) || estimatedDate;
          const upcomingEpisode = source?.episode ?? (f.lastEpisode !== undefined ? f.lastEpisode + 1 : undefined);

          return {
            uid: f.uid,
            animeId: f.animeId,
            title: f.title,
            subtitle: anime?.subtitle,
            originalTitle: f.originalTitle,
            thumbnail: anime?.thumbnail,
            lastEpisode: f.lastEpisode,
            lastPublishedAt: toDate(f.updatedAt || anime?.updatedAt),
            upcomingEpisode,
            upcomingAt,
            source: source?.source,
            sourceUrl: source?.url,
            isEstimate: !source?.date
          };
        });

        nextRows.sort((a, b) => {
          const aTime = a.upcomingAt ? a.upcomingAt.getTime() : Number.POSITIVE_INFINITY;
          const bTime = b.upcomingAt ? b.upcomingAt.getTime() : Number.POSITIVE_INFINITY;
          return aTime - bTime;
        });

        setRows(nextRows);
      } catch {
        setError('Could not fetch upcoming episodes.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [followed, requestItems, schedule, useAnimes.items]);

  if (!isMounted) {
    return (
      <Panel className="p-6">
        <div className="text-sm">Loading schedule...</div>
      </Panel>
    );
  }

  if (!followed.length) {
    return (
      <Panel className="p-6">
        <div className="text-sm">No followed animes yet.</div>
        <div className="text-xs text-secondary">Follow some animes to build your schedule.</div>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 text-xs">
        {SOURCES.map(s => <Pill key={s} label={s} />)}
      </div>

      {loading && (
        <Panel className="p-4">
          <div className="text-sm">Loading upcoming episodes...</div>
        </Panel>
      )}

      {error && (
        <Panel className="p-4 border-red-500">
          <div className="text-sm text-red-500">{error}</div>
        </Panel>
      )}

      <div className="md:flex flex-wrap">
        {rows.map(row => (
          <UpcomingScheduleCard
            key={row.uid}
            className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 3xl:w-1/6 4xl:w-1/7 5xl:w-1/8 min-w-80 h-auto"
            animeId={row.animeId}
            title={row.title}
            subtitle={row.subtitle}
            originalTitle={row.originalTitle}
            thumbnail={row.thumbnail}
            lastEpisode={row.lastEpisode}
            lastPublishedAt={row.lastPublishedAt}
            upcomingEpisode={row.upcomingEpisode}
            upcomingAt={row.upcomingAt}
            source={row.source}
            sourceUrl={row.sourceUrl}
            isEstimate={row.isEstimate}
          />
        ))}
      </div>
    </div>
  )
}

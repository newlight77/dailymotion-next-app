"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useWatchLists } from '../../hooks';
import { AnimeCard } from '@/donghua-context/animelist-feature';
import type { AnimeType } from '@/donghua-context/animelist-feature';

interface Props {
  listId: string,
  className?: string
}

export const WatchListDetail: React.FC<Props> = ({ listId, className }) => {
  const { data: session } = useSession();
  const sessionUserId = session?.user && (session.user as { id?: string }).id;

  const watchLists = useWatchLists();
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const loadedListsRef = useRef<boolean>(false);

  const { loadLists, loadListItems } = watchLists;
  const loadedListRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedListsRef.current) return;
    loadedListsRef.current = true;
    loadLists();
  }, [loadLists]);

  useEffect(() => {
    if (!listId) return;
    if (loadedListRef.current === listId) return;
    loadedListRef.current = listId;
    loadListItems(listId).then(list => {
      if (list) {
        setTitle(list.title);
        setIsPublic(!!list.isPublic);
      }
    });
  }, [listId, loadListItems]);

  useEffect(() => {
    const list = watchLists.lists?.find(l => l.uid === listId);
    if (list) {
      setTitle(list.title);
      setIsPublic(!!list.isPublic);
    }
  }, [listId, watchLists.lists]);

  const handleRename = async () => {
    if (!title.trim()) return;
    await watchLists.renameList(listId, title.trim());
  }

  const handleCopyLink = async () => {
    if (!isPublic) return;
    try {
      const url = `${window.location.origin}/watchlists/public/${listId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share URL', err);
    }
  }

  const [ratingsMap, setRatingsMap] = useState<Record<string, { average: number; count: number }>>({});

  const fetchRatingsFor = useCallback(async (animeIds: string[]) => {
    if (!animeIds || animeIds.length === 0) return;
    try {
      const results = await Promise.all(animeIds.map(async (id) => {
        try {
          const response = await fetch(`/api/ratings?animeId=${id}`);
          if (!response.ok) return { id, average: 0, count: 0 };
          const data = await response.json();
          return { id, average: Number(data?.average || 0), count: Number(data?.count || 0) };
        } catch (err) {
          return { id, average: 0, count: 0 };
        }
      }));

      const next: Record<string, { average: number; count: number }> = {};
      for (const r of results) {
        next[r.id] = { average: r.average, count: r.count };
      }
      setRatingsMap(next);
    } catch (error) {
      console.error('Failed to fetch ratings map', error);
    }
  }, []);

  function orderScore(anime: AnimeType, ratingAvg = 0): number {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayWeekDay = new Date().getDay();

    let updateDaysScore = 0;
    if (anime.updateDays) {
      for (let i = 0; i < 7; i++) {
        const day = daysOfWeek[(todayWeekDay + i) % 7].toLowerCase();
        if (anime.updateDays.toLowerCase().includes(day)) {
          updateDaysScore = 7 - i;
          break;
        }
      }
    }

    let updatedAtScore = 0;
    if (anime.updatedAt) {
      const updatedDate = new Date(anime.updatedAt);
      const now = new Date();
      const daysSinceUpdated = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceUpdated <= 30) {
        updatedAtScore = 10;
      } else if (daysSinceUpdated <= 90) {
        updatedAtScore = 7;
      } else if (daysSinceUpdated <= 180) {
        updatedAtScore = 5;
      } else if (daysSinceUpdated <= 365) {
        updatedAtScore = 3;
      } else if (daysSinceUpdated <= 730) {
        updatedAtScore = 1;
      }
    }

    let publishedAtScore = 0;
    if (anime.publishedAt) {
      const publishedDate = new Date(anime.publishedAt);
      const now = new Date();
      const daysSincePublished = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSincePublished <= 30) {
        publishedAtScore = 10;
      } else if (daysSincePublished <= 90) {
        publishedAtScore = 7;
      } else if (daysSincePublished <= 180) {
        publishedAtScore = 5;
      } else if (daysSincePublished <= 365) {
        publishedAtScore = 3;
      } else if (daysSincePublished <= 730) {
        publishedAtScore = 1;
      }
    }

    const ratingWeight = 4; // max 20 points
    const ratingScore = ratingAvg ? ratingAvg * ratingWeight : 0;

    return (updateDaysScore * 3) + updatedAtScore + publishedAtScore + ratingScore;
  }

  // determine ownership by looking up the current list and comparing to session user id
  const currentList = watchLists.lists?.find(l => l.uid === listId);
  const isOwner = !!currentList && !!sessionUserId && currentList.ownerId === sessionUserId;
  const listItems = (watchLists.items || [])
    .filter(item => item.listId === listId)
    .map(item => ({
      ...item,
      orderScore: item.anime ? orderScore(item.anime, item.anime ? (ratingsMap[item.anime.uid]?.average ?? 0) : 0) : Number.NEGATIVE_INFINITY,
    }))
    .sort((a, b) => b.orderScore - a.orderScore);

  // fetch ratings for all items in the list whenever list items change
  useEffect(() => {
    const ids = (watchLists.items || [])
      .filter(item => item.listId === listId && item.anime)
      .map(item => item.anime!.uid);
    fetchRatingsFor(ids);
  }, [watchLists.items, listId, fetchRatingsFor]);

  return (
    <div className={className}>
      <div className='p-4 flex flex-wrap items-center gap-2'>
        {isOwner ? (
          <>
            <input
              className='rounded-md p-2 border border-tertiary bg-secondary-variant text-sm'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button className='rounded-md border px-3 py-1 text-xs' onClick={handleRename}>rename</button>
            <div className='flex items-center gap-2'>
              <button
                className={`rounded-md border px-3 py-1 text-xs ${isPublic ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                onClick={async () => {
                  const next = !isPublic;
                  setIsPublic(next);
                  setIsToggling(true);
                  try {
                    await watchLists.setListVisibility(listId, next);
                  } catch (err) {
                    console.error('Failed to update visibility', err);
                    setIsPublic(!next);
                  } finally {
                    setIsToggling(false);
                  }
                }}
                disabled={isToggling}
              >
                {isToggling ? '...' : (isPublic ? 'Public' : 'Private')}
              </button>
              <span className='text-xs text-gray-400'>{isPublic ? 'public' : 'private'}</span>
            </div>
            <button
              className='rounded-md border px-3 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleCopyLink}
              disabled={!isPublic}
              title={isPublic ? 'Copy share link' : 'Make this list public to share'}
            >
              {copied ? 'copied' : 'copy public link'}
            </button>
          </>
        ) : (
          <div className='w-full'>
            <div className='font-semibold'>{title}</div>
            <span className='text-xs text-gray-400'>{isPublic ? 'public' : 'private'}</span>
          </div>
        )}
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'>
        {listItems.map(item => (
          item.anime ? (
            <AnimeCard
              key={item.uid}
              anime={item.anime}
              watchListId={listId}
              isInWatchListOverride={true}
              className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 min-w-80 h-auto"
              canModify={isOwner}
            />
          ) : null
        ))}
      </div>
    </div>
  );
};

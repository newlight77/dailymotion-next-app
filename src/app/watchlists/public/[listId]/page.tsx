"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AnimeCard } from '@/donghua-context/animelist-feature';
import type { AnimeType } from '@/donghua-context/animelist-feature';

type PublicListItem = {
  uid: string;
  animeId: string;
  anime?: {
    uid: string;
    title: string;
    subtitle?: string;
    originalTitle?: string;
    summary?: string;
    thumbnail?: string;
    thumbnailFilename?: string;
    publishedAt: string | Date;
    releaseAt: string | Date;
    updatedAt: string | Date;
  };
};

type PublicListResponse = {
  uid: string;
  title: string;
  isPublic: boolean;
  items: PublicListItem[];
};

const normalizeAnime = (anime: PublicListItem['anime']): AnimeType | null => {
  if (!anime) return null;
  return {
    uid: anime.uid,
    type: 'series',
    status: 'ongoing',
    title: anime.title,
    summary: anime.summary || '',
    thumbnail: anime.thumbnail || '',
    thumbnailFilename: anime.thumbnailFilename || '',
    studio: '',
    updateDays: '',
    publishedBy: '',
    publishedAt: anime.publishedAt ? new Date(anime.publishedAt) : new Date(),
    releaseAt: anime.releaseAt ? new Date(anime.releaseAt) : new Date(),
    updatedAt: anime.updatedAt ? new Date(anime.updatedAt) : new Date(),
    originalTitle: anime.originalTitle,
    subtitle: anime.subtitle,
  };
};

const PublicWatchListPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const [list, setList] = useState<PublicListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listId) return;
    const load = async () => {
      const response = await fetch(`/api/public/watchlists/${listId}`);
      if (!response.ok) {
        setError('Public watch list not found');
        return;
      }
      const data = await response.json();
      setList(data);
    };
    load();
  }, [listId]);

  if (error) {
    return <div className="p-4 text-sm">{error}</div>;
  }

  if (!list) {
    return <div className="p-4 text-sm">loading public watch list...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="title text-3xl p-1 md:p-4 capitalize">{list.title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {(list.items || []).map(item => {
          const anime = normalizeAnime(item.anime);
          return anime ? (
            <AnimeCard
              key={item.uid}
              anime={anime}
              className="pt-4 pb-4 xs:w-screen sm:w-screen md:w-1/2 lg:w-1/3 xl:w-1/4 min-w-80 h-auto"
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default PublicWatchListPage;

'use client'
import { useEffect, useRef } from 'react';
import { useStorage } from "@/core/core-lib/shared/useStorage";
import { FollowedAnimeType } from "../domain/model";
import { FollowedAnimesDrivenPort } from "../domain/port";
import { useAuth } from '@/core/capabilities/auth-feature/hooks';



export const useFollowedAnimesDrivenAdapter = (): FollowedAnimesDrivenPort => {

  const auth = useAuth();
  const {items, remove, addOrUpdate, loadData, clear} = useStorage<FollowedAnimeType>(`followed-animes`, []);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (auth.status !== 'authenticated') {
      loadedRef.current = false;
      return;
    }
    if (loadedRef.current) return;
    loadedRef.current = true;
    const loadFromServer = async () => {
      const response = await fetch('/api/followed-animes', { method: 'GET', credentials: 'include' });
      if (!response.ok) return;
      const data: FollowedAnimeType[] = await response.json();
      loadData(data);
    };
    loadFromServer();
  }, [auth.status, loadData]);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate: (followed: FollowedAnimeType) => {
      addOrUpdate(followed)
      if (auth.status !== 'authenticated') return;
      fetch('/api/followed-animes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(followed),
      }).catch(() => undefined);
    },

    remove: (uid: string) => {
      const existing = items?.find(item => item.uid === uid);
      remove(uid)
      if (auth.status !== 'authenticated' || !existing?.animeId) return;
      fetch(`/api/followed-animes?animeId=${encodeURIComponent(existing.animeId)}`, {
        method: 'DELETE',
        credentials: 'include',
      }).catch(() => undefined);
    },

    load: (animes: FollowedAnimeType[]) => {
      loadData(animes)
    },

    clear: () => {
      clear()
    }

  }
}
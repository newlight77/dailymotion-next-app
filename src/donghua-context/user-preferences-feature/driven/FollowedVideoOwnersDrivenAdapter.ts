'use client'
import { useEffect, useRef } from 'react';
import { useStorage } from "@/core/core-lib/shared/useStorage";
import { FollowedVideoOwnerType } from "../domain/model";
import { FollowedVideoOwnersDrivenPort } from "../domain/port";
import { useAuth } from '@/core/capabilities/auth-feature/hooks';



export const useFollowedVideoAnimesDrivenAdapter = (): FollowedVideoOwnersDrivenPort => {

  const auth = useAuth();
  const {items, remove, addOrUpdate, loadData, reset, clear } = useStorage<FollowedVideoOwnerType>(`followed-video-owners`, []);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (auth.status !== 'authenticated') {
      loadedRef.current = false;
      return;
    }
    if (loadedRef.current) return;
    loadedRef.current = true;
    const loadFromServer = async () => {
      const response = await fetch('/api/followed-owners', { method: 'GET', credentials: 'include' });
      if (!response.ok) return;
      const data: FollowedVideoOwnerType[] = await response.json();
      loadData(data);
    };
    loadFromServer();
  }, [auth.status, loadData]);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate: (followed: FollowedVideoOwnerType) => {
      addOrUpdate(followed)
      if (auth.status !== 'authenticated') return;
      fetch('/api/followed-owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(followed),
      }).catch(() => undefined);
    },

    remove: (uid: string) => {
      const existing = items?.find(item => item.uid === uid);
      remove(uid)
      if (auth.status !== 'authenticated' || !existing?.owner) return;
      fetch(`/api/followed-owners?owner=${encodeURIComponent(existing.owner)}`, {
        method: 'DELETE',
        credentials: 'include',
      }).catch(() => undefined);
    },

    load: (animes: FollowedVideoOwnerType[]) => {
      loadData(animes)
    },

    reset: () => {
      reset()
    },

    clear: () => {
      clear()
    },

  }
}
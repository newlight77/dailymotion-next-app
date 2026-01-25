'use client'
import { useCallback, useMemo } from "react";
import { AnimeType } from "@/donghua-context/animelist-feature";
import { WatchListItemType, WatchListType } from "../domain";
import { WatchListsDrivenPort } from "../domain/port";
import { useStorage } from "@/core/core-lib/shared/useStorage";

const mapListDates = (list: WatchListType): WatchListType => ({
  ...list,
  createdAt: new Date(list.createdAt),
  updatedAt: new Date(list.updatedAt),
});

const mapItemDates = (item: WatchListItemType): WatchListItemType => ({
  ...item,
  createdAt: new Date(item.createdAt),
  anime: item.anime
    ? {
        ...item.anime,
        publishedAt: new Date(item.anime.publishedAt),
        releaseAt: new Date(item.anime.releaseAt),
        updatedAt: new Date(item.anime.updatedAt),
      }
    : item.anime,
});

export const useWatchListsDrivenAdapter = (): WatchListsDrivenPort => {
  const listStore = useStorage<WatchListType>('watchlists', []);
  const itemStore = useStorage<WatchListItemType>('watchlist-items', []);

  const loadListsData = useCallback((data: WatchListType[]) => {
    listStore.loadData(data);
  }, [listStore]);

  const loadItemsData = useCallback((data: WatchListItemType[]) => {
    itemStore.loadData(data);
  }, [itemStore]);

  const addOrUpdateList = useCallback((list: WatchListType) => {
    listStore.addOrUpdate(list);
  }, [listStore]);

  const addOrUpdateItem = useCallback((item: WatchListItemType) => {
    itemStore.addOrUpdate(item);
  }, [itemStore]);

  const removeList = useCallback((listId: string) => {
    listStore.remove(listId);
  }, [listStore]);

  const removeItem = useCallback((itemId: string) => {
    itemStore.remove(itemId);
  }, [itemStore]);

  const clearLists = useCallback(() => {
    listStore.clear();
  }, [listStore]);

  const clearItems = useCallback(() => {
    itemStore.clear();
  }, [itemStore]);

  return useMemo(() => ({
    lists: () => listStore.items || [],
    items: () => itemStore.items || [],

    loadLists: (data: WatchListType[]) => {
      loadListsData(data.map(mapListDates));
    },

    loadItems: (data: WatchListItemType[]) => {
      loadItemsData(data.map(mapItemDates));
    },

    addOrUpdateList: (list: WatchListType) => {
      addOrUpdateList(mapListDates(list));
    },

    removeList: (listId: string) => {
      removeList(listId);
    },

    addOrUpdateItem: (item: WatchListItemType) => {
      addOrUpdateItem(mapItemDates(item));
    },

    removeItemByAnimeId: (animeId: string) => {
        const existing = itemStore.items?.find(i => i.animeId === animeId);
      if (existing?.uid) {
        removeItem(existing.uid);
      }
    },

    clear: () => {
      clearLists();
      clearItems();
    },

    fetchLists: async (): Promise<WatchListType[] | undefined> => {
      try {
        const response = await fetch('/api/watchlists', { method: 'GET', credentials: 'include' });
        if (!response.ok) {
          if (response.status === 401) return undefined;
          throw new Error(`Failed to fetch watch lists: ${response.statusText}`);
        }
        const lists: WatchListType[] = await response.json();
        return lists.map(mapListDates);
      } catch (error) {
        console.error('Error fetching watch lists:', error);
        return undefined;
      }
    },

    createList: async (title: string): Promise<WatchListType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title })
        });
        if (!response.ok) {
          throw new Error(`Failed to create watch list: ${response.statusText}`);
        }
        const list: WatchListType = await response.json();
        return mapListDates(list);
      } catch (error) {
        console.error('Error creating watch list:', error);
        return undefined;
      }
    },

    renameList: async (listId: string, title: string): Promise<WatchListType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${listId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title })
        });
        if (!response.ok) {
          throw new Error(`Failed to rename watch list: ${response.statusText}`);
        }
        const list: WatchListType = await response.json();
        return mapListDates(list);
      } catch (error) {
        console.error('Error renaming watch list:', error);
        return undefined;
      }
    },

    setListVisibility: async (listId: string, isPublic: boolean): Promise<WatchListType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${listId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ isPublic })
        });
        if (!response.ok) {
          throw new Error(`Failed to update watch list visibility: ${response.statusText}`);
        }
        const list: WatchListType = await response.json();
        return mapListDates(list);
      } catch (error) {
        console.error('Error updating watch list visibility:', error);
        return undefined;
      }
    },

    deleteList: async (listId: string): Promise<void> => {
      try {
        const response = await fetch(`/api/watchlists/${listId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!response.ok && response.status !== 204) {
          throw new Error(`Failed to delete watch list: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting watch list:', error);
      }
    },

    fetchList: async (listId: string): Promise<(WatchListType & { items: WatchListItemType[] }) | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${listId}`, { method: 'GET', credentials: 'include' });
        if (!response.ok) {
          if (response.status === 404) return undefined;
          throw new Error(`Failed to fetch watch list: ${response.statusText}`);
        }
        const list = await response.json();
        return {
          ...mapListDates(list),
          items: (list.items || []).map(mapItemDates),
        } as WatchListType & { items: WatchListItemType[] };
      } catch (error) {
        console.error('Error fetching watch list:', error);
        return undefined;
      }
    },

    addAnime: async (listId: string, anime: AnimeType): Promise<WatchListItemType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${listId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ animeId: anime.uid })
        });
        if (!response.ok) {
          throw new Error(`Failed to add anime to watch list: ${response.statusText}`);
        }
        const item: WatchListItemType = await response.json();
        return mapItemDates(item);
      } catch (error) {
        console.error('Error adding anime to watch list:', error);
        return undefined;
      }
    },

    removeAnime: async (listId: string, animeId: string): Promise<void> => {
      try {
        const response = await fetch(`/api/watchlists/${listId}?animeId=${animeId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!response.ok && response.status !== 204) {
          throw new Error(`Failed to remove anime from watch list: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error removing anime from watch list:', error);
      }
    }
  }), [
    listStore.items,
    itemStore.items,
    loadListsData,
    loadItemsData,
    addOrUpdateList,
    removeList,
    addOrUpdateItem,
    removeItem,
    clearLists,
    clearItems
  ])
}

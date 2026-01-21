'use client'
import { useCallback, useMemo, useState } from "react";
import { AnimeType } from "@/donghua-context/animelist-feature";
import { WatchListCollectionType, WatchListItemType, WatchListType } from "../domain";
import { WatchListsDrivenPort } from "../domain/port";

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
  const [lists, setLists] = useState<WatchListType[]>([]);
  const [items, setItems] = useState<WatchListItemType[]>([]);

  const loadListsData = useCallback((data: WatchListType[]) => {
    setLists(data);
  }, []);

  const loadItemsData = useCallback((data: WatchListItemType[]) => {
    setItems(data);
  }, []);

  const addOrUpdateList = useCallback((list: WatchListType) => {
    setLists(prev => {
      const exists = prev.find(item => item.uid === list.uid);
      if (exists) {
        return prev.map(item => item.uid === list.uid ? list : item);
      }
      return [list, ...prev];
    });
  }, []);

  const addOrUpdateItem = useCallback((item: WatchListItemType) => {
    setItems(prev => {
      const exists = prev.find(it => it.uid === item.uid || it.animeId === item.animeId);
      if (exists) {
        return prev.map(it => (it.uid === item.uid || it.animeId === item.animeId) ? item : it);
      }
      return [item, ...prev];
    });
  }, []);

  const removeList = useCallback((listId: string) => {
    setLists(prev => prev.filter(item => item.uid !== listId));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.uid !== itemId));
  }, []);

  const clearLists = useCallback(() => {
    setLists([]);
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  return useMemo(() => ({
    lists: () => lists || [],
    items: () => items || [],

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
      const existing = items?.find(i => i.animeId === animeId);
      if (existing?.uid) {
        removeItem(existing.uid);
      }
    },

    clear: () => {
      clearLists();
      clearItems();
    },

    createCollection: async (): Promise<WatchListCollectionType | undefined> => {
      try {
        const response = await fetch('/api/watchlists', { method: 'POST' });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          const message = (errorBody as { error?: string }).error || response.statusText;
          throw new Error(`Failed to create watch list collection: ${message}`);
        }
        const collection: WatchListCollectionType = await response.json();
        return {
          ...collection,
          createdAt: new Date(collection.createdAt),
          updatedAt: new Date(collection.updatedAt),
        };
      } catch (error) {
        console.error('Error creating watch list collection:', error);
        return undefined;
      }
    },

    fetchCollection: async (collectionId: string): Promise<WatchListCollectionType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${collectionId}`, { method: 'GET' });
        if (!response.ok) {
          if (response.status === 404) return undefined;
          throw new Error(`Failed to fetch watch list collection: ${response.statusText}`);
        }
        const collection: WatchListCollectionType = await response.json();
        return {
          ...collection,
          createdAt: new Date(collection.createdAt),
          updatedAt: new Date(collection.updatedAt),
          lists: collection.lists?.map(mapListDates),
        };
      } catch (error) {
        console.error('Error fetching watch list collection:', error);
        return undefined;
      }
    },

    createList: async (collectionId: string, title: string): Promise<WatchListType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${collectionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

    renameList: async (collectionId: string, listId: string, title: string): Promise<WatchListType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${collectionId}/${listId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
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

    deleteList: async (collectionId: string, listId: string): Promise<void> => {
      try {
        const response = await fetch(`/api/watchlists/${collectionId}/${listId}`, {
          method: 'DELETE'
        });
        if (!response.ok && response.status !== 204) {
          throw new Error(`Failed to delete watch list: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting watch list:', error);
      }
    },

    fetchList: async (collectionId: string, listId: string): Promise<(WatchListType & { items: WatchListItemType[] }) | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${collectionId}/${listId}`, { method: 'GET' });
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

    addAnime: async (collectionId: string, listId: string, anime: AnimeType): Promise<WatchListItemType | undefined> => {
      try {
        const response = await fetch(`/api/watchlists/${collectionId}/${listId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

    removeAnime: async (collectionId: string, listId: string, animeId: string): Promise<void> => {
      try {
        const response = await fetch(`/api/watchlists/${collectionId}/${listId}?animeId=${animeId}`, {
          method: 'DELETE'
        });
        if (!response.ok && response.status !== 204) {
          throw new Error(`Failed to remove anime from watch list: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error removing anime from watch list:', error);
      }
    }
  }), [
    lists,
    items,
    removeList,
    addOrUpdateList,
    loadListsData,
    clearLists,
    removeItem,
    addOrUpdateItem,
    loadItemsData,
    clearItems
  ])
}

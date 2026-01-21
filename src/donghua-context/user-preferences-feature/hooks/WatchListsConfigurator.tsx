'use client'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createContext } from "react";
import { AnimeType } from '@/donghua-context/animelist-feature';
import { WatchListCollectionType, WatchListItemType, WatchListType } from '../domain';
import { watchListsQuery, watchListsUsecase } from '../domain/usecases';
import { watchListsDriverAdapter } from '../driver/WatchListsDriverAdapter';
import { useWatchListsDrivenAdapter } from '../driven/WatchListsDrivenAdapter';

export interface WatchListsContextType {
  collectionId?: string,
  lists: WatchListType[] | undefined,
  items: WatchListItemType[] | undefined,
  loadCollection: (collectionId: string) => Promise<WatchListCollectionType | undefined>,
  createCollection: () => Promise<WatchListCollectionType | undefined>,
  createList: (title: string) => Promise<WatchListType | undefined>,
  renameList: (listId: string, title: string) => Promise<WatchListType | undefined>,
  deleteList: (listId: string) => Promise<void>,
  loadListItems: (listId: string) => Promise<(WatchListType & { items: WatchListItemType[] }) | undefined>,
  addAnime: (listId: string, anime: AnimeType) => Promise<WatchListItemType | undefined>,
  removeAnime: (listId: string, animeId: string) => Promise<void>,
  clear: () => void
}

export const WatchListsContext = createContext<WatchListsContextType>({
  collectionId: undefined,
  lists: [],
  items: [],
  loadCollection: async (collectionId: string) => { console.log('load collection', collectionId); return undefined },
  createCollection: async () => { console.log('create collection'); return undefined },
  createList: async (title: string) => { console.log('create list', title); return undefined },
  renameList: async (listId: string, title: string) => { console.log('rename list', listId, title); return undefined },
  deleteList: async (listId: string) => { console.log('delete list', listId); },
  loadListItems: async (listId: string) => { console.log('load list items', listId); return undefined },
  addAnime: async (listId: string, anime: AnimeType) => { console.log('add anime', listId, anime); return undefined },
  removeAnime: async (listId: string, animeId: string) => { console.log('remove anime', listId, animeId); },
  clear: () => {}
});

type Props = {
  children: React.ReactNode
}

export const WatchListsConfigurator = ({ children }: Props): React.ReactElement => {
  const driven = useWatchListsDrivenAdapter();
  const driver = useMemo(
    () => watchListsDriverAdapter(watchListsUsecase(driven), watchListsQuery(driven)),
    [driven]
  );
  const [collectionId, setCollectionId] = useState<string | undefined>(undefined);
  const lastLoadedCollectionRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('watchlists-collection-id');
    if (stored) setCollectionId(stored);
  }, []);

  const loadCollection = useCallback(async (id: string) => {
    if (lastLoadedCollectionRef.current === id) {
      return driver.loadCollection(id);
    }
    lastLoadedCollectionRef.current = id;
    setCollectionId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('watchlists-collection-id', id);
    }
    return driver.loadCollection(id);
  }, [driver]);

  const createCollection = useCallback(async () => {
    const collection = await driver.createCollection();
    if (collection?.uid) {
      setCollectionId(collection.uid);
      if (typeof window !== 'undefined') {
        localStorage.setItem('watchlists-collection-id', collection.uid);
      }
    }
    return collection;
  }, [driver]);

  const createList = useCallback(async (title: string) => {
    if (!collectionId) {
      const collection = await createCollection();
      if (!collection?.uid) return undefined;
    }
    return driver.createList(collectionId as string, title);
  }, [collectionId, createCollection, driver]);

  const renameList = useCallback(async (listId: string, title: string) => {
    if (!collectionId) return undefined;
    return driver.renameList(collectionId, listId, title);
  }, [collectionId, driver]);

  const deleteList = useCallback(async (listId: string) => {
    if (!collectionId) return;
    return driver.deleteList(collectionId, listId);
  }, [collectionId, driver]);

  const loadListItems = useCallback(async (listId: string) => {
    if (!collectionId) return undefined;
    return driver.loadListItems(collectionId, listId);
  }, [collectionId, driver]);

  const addAnime = useCallback(async (listId: string, anime: AnimeType) => {
    if (!collectionId) return undefined;
    return driver.addAnime(collectionId, listId, anime);
  }, [collectionId, driver]);

  const removeAnime = useCallback(async (listId: string, animeId: string) => {
    if (!collectionId) return;
    return driver.removeAnime(collectionId, listId, animeId);
  }, [collectionId, driver]);

  const clear = useCallback(() => {
    driver.clear();
  }, [driver]);

  const lists = driver.lists();
  const items = driver.items();

  const value = useMemo(() => ({
    collectionId,
    lists,
    items,
    loadCollection,
    createCollection,
    createList,
    renameList,
    deleteList,
    loadListItems,
    addAnime,
    removeAnime,
    clear,
  }), [
    collectionId,
    lists,
    items,
    loadCollection,
    createCollection,
    createList,
    renameList,
    deleteList,
    loadListItems,
    addAnime,
    removeAnime,
    clear,
  ]);

  return (
    <WatchListsContext.Provider value={value}>
      {children}
    </WatchListsContext.Provider>
  )
}

export const useWatchLists = (): WatchListsContextType => useContext(WatchListsContext)

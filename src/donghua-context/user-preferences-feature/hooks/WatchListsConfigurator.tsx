'use client'
import React, { useCallback, useContext, useMemo } from 'react';
import { createContext } from "react";
import { AnimeType } from '@/donghua-context/animelist-feature';
import { WatchListItemType, WatchListType } from '../domain';
import { watchListsQuery, watchListsUsecase } from '../domain/usecases';
import { watchListsDriverAdapter } from '../driver/WatchListsDriverAdapter';
import { useWatchListsDrivenAdapter } from '../driven/WatchListsDrivenAdapter';

export interface WatchListsContextType {
  lists: WatchListType[] | undefined,
  items: WatchListItemType[] | undefined,
  loadLists: () => Promise<WatchListType[] | undefined>,
  createList: (title: string) => Promise<WatchListType | undefined>,
  renameList: (listId: string, title: string) => Promise<WatchListType | undefined>,
  setListVisibility: (listId: string, isPublic: boolean) => Promise<WatchListType | undefined>,
  deleteList: (listId: string) => Promise<void>,
  loadListItems: (listId: string) => Promise<(WatchListType & { items: WatchListItemType[] }) | undefined>,
  addAnime: (listId: string, anime: AnimeType) => Promise<WatchListItemType | undefined>,
  removeAnime: (listId: string, animeId: string) => Promise<void>,
  clear: () => void
}

export const WatchListsContext = createContext<WatchListsContextType>({
  lists: [],
  items: [],
  loadLists: async () => { console.log('load lists'); return undefined },
  createList: async (title: string) => { console.log('create list', title); return undefined },
  renameList: async (listId: string, title: string) => { console.log('rename list', listId, title); return undefined },
  setListVisibility: async (listId: string, isPublic: boolean) => { console.log('set list visibility', listId, isPublic); return undefined },
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
  const loadLists = useCallback(async () => {
    return driver.loadLists();
  }, [driver]);

  const createList = useCallback(async (title: string) => {
    return driver.createList(title);
  }, [driver]);

  const renameList = useCallback(async (listId: string, title: string) => {
    return driver.renameList(listId, title);
  }, [driver]);

  const setListVisibility = useCallback(async (listId: string, isPublic: boolean) => {
    return driver.setListVisibility(listId, isPublic);
  }, [driver]);

  const deleteList = useCallback(async (listId: string) => {
    return driver.deleteList(listId);
  }, [driver]);

  const loadListItems = useCallback(async (listId: string) => {
    return driver.loadListItems(listId);
  }, [driver]);

  const addAnime = useCallback(async (listId: string, anime: AnimeType) => {
    return driver.addAnime(listId, anime);
  }, [driver]);

  const removeAnime = useCallback(async (listId: string, animeId: string) => {
    return driver.removeAnime(listId, animeId);
  }, [driver]);

  const clear = useCallback(() => {
    driver.clear();
  }, [driver]);

  const lists = driver.lists();
  const items = driver.items();

  const value = useMemo(() => ({
    lists,
    items,
    loadLists,
    createList,
    renameList,
    setListVisibility,
    deleteList,
    loadListItems,
    addAnime,
    removeAnime,
    clear,
  }), [
    lists,
    items,
    loadLists,
    createList,
    renameList,
    setListVisibility,
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

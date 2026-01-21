import { FollowedAnimeType, FollowedVideoOwnerType, LastViewType, SearchKeywordsType, WatchListCollectionType, WatchListItemType, WatchListType } from "../model"
import { AnimeType } from "@/donghua-context/animelist-feature"


export type FollowedAnimesDriverPort = {
  items: () => FollowedAnimeType[],
  remove: (uid: string) => void,
  addOrUpdate: (followed: FollowedAnimeType) => void,
  load: (animes: FollowedAnimeType[]) => void
  clear: () => void
}

export type FollowedVideoOwnersDriverPort = {
  items: () => FollowedVideoOwnerType[],
  remove: (uid: string) => void,
  addOrUpdate: (followed: FollowedVideoOwnerType) => void,
  load: (animes: FollowedVideoOwnerType[]) => void,
  reset: () => void,
  clear: () => void,
}

export type LastViewsDriverPort = {
  items: () => LastViewType[],
  addOrUpdate : (lastView: LastViewType) => void,
  remove: (uid: string) => void,
  clear: () => void
}

export type VideoSearchHistoryDriverPort = {
  items: () => SearchKeywordsType[],
  addOrUpdate : (keywords: SearchKeywordsType) => void,
  remove: (uid: string) => void,
  clear: () => void
}

export type WatchListsDriverPort = {
  lists: () => WatchListType[],
  items: () => WatchListItemType[],
  loadCollection: (collectionId: string) => Promise<WatchListCollectionType | undefined>,
  createCollection: () => Promise<WatchListCollectionType | undefined>,
  createList: (collectionId: string, title: string) => Promise<WatchListType | undefined>,
  renameList: (collectionId: string, listId: string, title: string) => Promise<WatchListType | undefined>,
  deleteList: (collectionId: string, listId: string) => Promise<void>,
  loadListItems: (collectionId: string, listId: string) => Promise<(WatchListType & { items: WatchListItemType[] }) | undefined>,
  addAnime: (collectionId: string, listId: string, anime: AnimeType) => Promise<WatchListItemType | undefined>,
  removeAnime: (collectionId: string, listId: string, animeId: string) => Promise<void>,
  clear: () => void
}

import { FollowedAnimeType, FollowedVideoOwnerType, LastViewType, SearchKeywordsType, WatchListItemType, WatchListType } from "../model"
import { AnimeType } from "@/donghua-context/animelist-feature"


export type FollowedAnimesDrivenPort = {
  items: () => FollowedAnimeType[],
  remove: (uid: string) => void,
  addOrUpdate: (followed: FollowedAnimeType) => void,
  load: (animes: FollowedAnimeType[]) => void,
  clear: () => void
}

export type FollowedVideoOwnersDrivenPort = {
  items: () => FollowedVideoOwnerType[],
  remove: (uid: string) => void,
  addOrUpdate: (fav: FollowedVideoOwnerType) => void,
  load: (animes: FollowedVideoOwnerType[]) => void,
  reset: () => void,
  clear: () => void,
}

export type LastViewsDrivenPort = {
  items: () => LastViewType[],
  addOrUpdate : (lastView: LastViewType) => void,
  remove: (uid: string) => void,
  clear: () => void
}

export type VideoSearchHistoryDrivenPort = {
  items: () => SearchKeywordsType[],
  addOrUpdate : (keywords: SearchKeywordsType) => void,
  remove: (uid: string) => void,
  clear: () => void
}

export type WatchListsDrivenPort = {
  lists: () => WatchListType[],
  items: () => WatchListItemType[],
  loadLists: (lists: WatchListType[]) => void,
  loadItems: (items: WatchListItemType[]) => void,
  addOrUpdateList: (list: WatchListType) => void,
  removeList: (listId: string) => void,
  addOrUpdateItem: (item: WatchListItemType) => void,
  removeItemByAnimeId: (animeId: string) => void,
  clear: () => void,
  fetchLists: () => Promise<WatchListType[] | undefined>,
  createList: (title: string) => Promise<WatchListType | undefined>,
  renameList: (listId: string, title: string) => Promise<WatchListType | undefined>,
  setListVisibility: (listId: string, isPublic: boolean) => Promise<WatchListType | undefined>,
  deleteList: (listId: string) => Promise<void>,
  fetchList: (listId: string) => Promise<(WatchListType & { items: WatchListItemType[] }) | undefined>,
  addAnime: (listId: string, anime: AnimeType) => Promise<WatchListItemType | undefined>,
  removeAnime: (listId: string, animeId: string) => Promise<void>
}

import { FollowedVideoOwnerType, LastViewType, SearchKeywordsType, WatchListItemType, WatchListType } from "../model"
import { AnimeType } from "@/donghua-context/animelist-feature"


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

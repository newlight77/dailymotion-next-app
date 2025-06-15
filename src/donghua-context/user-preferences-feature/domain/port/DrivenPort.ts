import { FollowedAnimeType, FollowedVideoOwnerType, LastViewType, SearchKeywordsType } from "../model"


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

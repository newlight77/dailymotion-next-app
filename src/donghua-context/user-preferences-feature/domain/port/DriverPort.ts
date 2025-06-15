import { FollowedAnimeType, FollowedVideoOwnerType, LastViewType, SearchKeywordsType } from "../model"


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

import { AnimeType } from "@/donghua-context/animelist-feature";

export type FollowedAnimeType = {
  uid: string,
  animeId: string,
  title: string,
  originalTitle?: string,
  subtitle?: string,
  lastEpisode?: number,
  updatedAt: Date,
}

export type SearchKeywordsType = {
    uid: string,
    keywords: string,
}

export type FollowedVideoOwnerType = {
  uid: string,
  owner: string,
  order: number,
}

export type LastViewType = {
  uid: string,
  videoId: string,
  title: string,
  episode: number,
  owner: string,
  link: string,
}

export type VideoType = {
  videoId: string,
  title: string,
  owner: string,
  episode: number,
  link: string,
}

export type WatchListCollectionType = {
  uid: string,
  createdAt: Date,
  updatedAt: Date,
  lists?: WatchListType[],
}

export type WatchListType = {
  uid: string,
  collectionId: string,
  title: string,
  createdAt: Date,
  updatedAt: Date,
}

export type WatchListItemType = {
  uid: string,
  listId: string,
  animeId: string,
  createdAt: Date,
  anime?: AnimeType
}

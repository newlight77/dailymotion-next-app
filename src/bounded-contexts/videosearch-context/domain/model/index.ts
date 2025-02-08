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

export type FavoriteType = {
  uid: string,
  animeId: string,
  title: string,
  order: number,
  originalTitle?: string,
  subtitle?: string,
  owner?: string,
  lastEpisode?: number,
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

export interface MetaVideoType {
  id: string,
  title: string,
  description: string,
  channel: string,
  channelId: string,
  channelSlug: string,
  channelName: string,
  channelDescription: string,
  country: string,
  owner: string,
  ownerId: string,
  ownerUrl: string,
  ownerUsername: string,
  ownerCountry: string,
  ownerLanguage: string,
  language: string,
  thumbnail_url: string,
  thumbnail_180_url: string,
  thumbnail_240_url: string,
  thumbnail_360_url: string,
  thumbnail_480_url: string,
  updated_time: number,
  duration: number,
}
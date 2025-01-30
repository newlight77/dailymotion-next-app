export type AnimeType = {
  uid: string,
  type: 'movie' | 'series',
  status: 'completed' | 'ongoing',
  title: string,
  summary: string,
  thumbnail: string,
  studio: string,
  publishedBy: string,
  publishedAt: Date,
  releaseAt: Date,
  updateAt: Date,
  originalTitle?: string,
  subtitle?: string,
  lastEpisode?: number,
  totalEpisodes?: number
}

export type SearchKeywordsType = {
    uid: string,
    keywords: string,
}

export type FavoriteType = {
  uid: string,
  title: string,
  order: number,
  completed: false,
  originalTitle?: string,
  subtitle?: string,
  owner?: string,
  lastEpisode?: number,
  total?: number
}

export type FollowingType = {
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
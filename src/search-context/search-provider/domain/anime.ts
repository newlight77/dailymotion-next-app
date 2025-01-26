export type AnimeType = {
  uid: string,
  type: 'movie' | 'series',
  status: 'completed' | 'ongoing',
  title: string,
  summary: string,
  thumbnail: string,
  publishedBy: string,
  publishedAt: Date,
  updateAt: Date,
  originalTitle?: string,
  subtitle?: string,
  lastEpisode?: number,
  totalEpisodes?: number
}

export type FavoriteType = {
  uid: string,
  title: string,
  order: number,
  originalTitle?: string,
  subtitle?: string,
  owner?: string,
  lastEpisode?: string,
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
  episode: string,
  owner: string,
  link: string,
}

export type VideoType = {
  videoId: string
  title: string,
  owner: string,
  episode: string,
  link: string,
}

export interface MetaVideo {
  id: string;
  title: string;
  description: string;
  channel: string;
  channelId: string;
  channelSlug: string;
  channelName: string;
  channelDescription: string;
  country: string;
  owner: string,
  ownerId: string,
  ownerUrl: string;
  ownerUsername: string;
  ownerCountry: string;
  ownerLanguage: string;
  language: string;
  thumbnail_url: string;
  thumbnail_180_url: string;
  thumbnail_240_url: string;
  thumbnail_360_url: string;
  thumbnail_480_url: string;
  updated_time: number;
  duration: number;
}
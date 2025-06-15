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

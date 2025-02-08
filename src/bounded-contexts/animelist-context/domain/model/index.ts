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
  updatedAt: Date,
  originalTitle?: string,
  subtitle?: string,
  lastEpisode?: number,
  totalEpisodes?: number
}

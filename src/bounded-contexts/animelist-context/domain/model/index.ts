export type AnimeType = {
  uid: string,
  type: 'movie' | 'series',
  status: 'completed' | 'ongoing',
  title: string,
  summary: string,
  thumbnail: string,
  thumbnailFilename: string,
  studio: string,
  updateDays: string,
  publishedBy: string,
  publishedAt: Date,
  releaseAt: Date,
  updatedAt: Date,
  originalTitle?: string,
  subtitle?: string,
  firstSeasonEpisode?: number,
  lastSeasonEpisode?: number,
  totalSeasonEpisodes?: number,
  lastEpisode?: number,
  totalEpisodes?: number
}

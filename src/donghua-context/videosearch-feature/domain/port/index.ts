import { PreferencesType, VideoSearchResponse, VideoSearchWithScoreResponse, VideoType } from "../model"
import { VideoSearchParamsType } from "../model"

export interface VideoSearchPort {
  search: (searchParams: VideoSearchParamsType) => Promise<VideoSearchResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}

export interface VideoSearchUsecasePort {
  search: (searchParams: VideoSearchParamsType, prefs?: PreferencesType) => Promise<VideoSearchWithScoreResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}

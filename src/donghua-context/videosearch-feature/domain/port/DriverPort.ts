import { PreferencesType, VideoSearchWithScoreResponse, VideoType } from "../model"
import { VideoSearchParamsType } from "../model"

export interface VideoSearchDriverPort {
  search: (searchParams: VideoSearchParamsType, prefs?: PreferencesType) => Promise<VideoSearchWithScoreResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}
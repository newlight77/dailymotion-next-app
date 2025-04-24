import { VideoSearchResponse, VideoType } from "../model"
import { VideoSearchParamsType } from "../model"

export interface VideoSearchDrivenPort {
  search: (searchParams: VideoSearchParamsType) => Promise<VideoSearchResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}
import { VideoSearchParamsType, VideoSearchResponse, VideoType } from "../model"

export interface VideoSearchDrivenPort {
  getById: (id: string) => Promise<VideoType | undefined>
  search: (searchParams: VideoSearchParamsType) => Promise<VideoSearchResponse>
}
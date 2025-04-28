import { VideoSearchParamsType, VideoSearchResponse, VideoType } from "../model"

export interface VideoSearchDrivenReadPort {
  getById: (id: string) => Promise<VideoType | undefined>
  search: (searchParams: VideoSearchParamsType) => Promise<VideoSearchResponse>
}
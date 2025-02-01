import { MetaVideoType, VideoType } from "@/bounded-contexts/video-search-context/domain/model/anime";


export type VideoSearchParams = {
    search: string,
    limit: number,
    page: number
}

export type VideoSearchResponse = {
  search: string,
  page: number,
  limit: number,
  list: MetaVideoType[],
  hasMore: boolean,
}

export interface VideoSearchPort {
  search: (keywords: VideoSearchParams) => Promise<VideoSearchResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}

// export const VideoSearchUsecase = (port: VideoSearchPort) => {

//   const search = async (keywords: string): Promise<VideoSearchResponse> => {
//     return {} as VideoSearchResponse
//   }

//   const getById = async (id: string): Promise<VideoType | undefined> => {
//     return undefined
//   }

//   return {
//     search,
//   }
// }
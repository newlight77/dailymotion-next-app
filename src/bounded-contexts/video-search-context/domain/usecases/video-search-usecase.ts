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

type SearchParamsType = { search: string, limit: number, page: number }

export interface VideoSearchPort {
  search: (keywords: VideoSearchParams) => Promise<VideoSearchResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}

export const VideoSearchUsecase = (port: VideoSearchPort) => {

  const search = async (searchParams: SearchParamsType): Promise<VideoSearchResponse> => {
    return await port.search(searchParams)
  }

  const getById = async (id: string): Promise<VideoType | undefined> => {
    return await port.getById(id)
  }

  return {
    search,
    getById
  }
}
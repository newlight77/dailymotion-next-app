import { VideoType } from "../model";
import { VideoSearchDrivenPort } from "../port";


export type VideoSearchQueryType = {
  getById: (id: string) => Promise<VideoType | undefined>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const videoSearchQuery = (port: VideoSearchDrivenPort): VideoSearchQueryType => {

  // this is a query use case
  const getById = async (id: string): Promise<VideoType | undefined> => {
    return await port.getById(id)
  }

  return {
    getById
  }
}

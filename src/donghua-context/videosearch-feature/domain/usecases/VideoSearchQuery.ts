import { VideoType } from "../model";
import { VideoSearchDrivenReadPort } from "../port";


export type VideoSearchQueryType = {
  getById: (id: string) => Promise<VideoType | undefined>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const videoSearchQuery = (readPort: VideoSearchDrivenReadPort): VideoSearchQueryType => {

  // this is a query use case
  const getById = async (id: string): Promise<VideoType | undefined> => {
    return await readPort.getById(id)
  }

  return {
    getById
  }
}

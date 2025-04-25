import { VideoSearchDrivenPort } from "../port";


export type VideoSearchQueryType = {
  none: undefined
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const videoSearchQuery = (port: VideoSearchDrivenPort): VideoSearchQueryType => {

  return {
    // there is no query
    none: undefined
  }
}

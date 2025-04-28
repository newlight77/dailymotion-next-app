import { SearchKeywordsType } from "../model";
import { VideoSearchHistoryDrivenPort } from "../port";


export type VideoSearchHistoryQueryType = {
  items: () => SearchKeywordsType[],
}

export const videoSearchHistoryQuery = (drivenPort: VideoSearchHistoryDrivenPort) : VideoSearchHistoryQueryType => {

  return {
    items: () => {
      return drivenPort.items()
    },
  }

}
import { SearchKeywordsType } from "../model";
import { VideoSearchHistoryDrivenPort } from "../port";


export type VideoSearchHistoryUsecaseType = {
  items: () => SearchKeywordsType[],
  addOrUpdate : (keywords: SearchKeywordsType) => void,
  remove : (uid: string) => void,
  clear : () => void,
}

export const videoSearchHistoryUsecase = (drivenPort: VideoSearchHistoryDrivenPort) : VideoSearchHistoryUsecaseType => {

  return {

    items: () => {
      return drivenPort.items()
    },

    addOrUpdate : (keywords: SearchKeywordsType) => {
      drivenPort.addOrUpdate(keywords)
    },

    remove : (uid: string) => {
      drivenPort.remove(uid)
    },

    clear : () => {
      drivenPort.clear()
    },
  }

}
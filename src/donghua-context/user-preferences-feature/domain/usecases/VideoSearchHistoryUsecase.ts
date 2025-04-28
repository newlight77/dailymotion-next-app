import { SearchKeywordsType } from "../model";
import { VideoSearchHistoryDrivenPort } from "../port";


export type VideoSearchHistoryUsecaseType = {
  addOrUpdate : (keywords: SearchKeywordsType) => void,
  remove : (uid: string) => void,
  clear : () => void,
}

export const videoSearchHistoryUsecase = (drivenPort: VideoSearchHistoryDrivenPort) : VideoSearchHistoryUsecaseType => {

  return {
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
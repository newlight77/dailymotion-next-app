import { SearchKeywordsType } from "../domain";
import { VideoSearchHistoryDriverPort } from "../domain/port";
import { VideoSearchHistoryUsecaseType } from '../domain/usecases'



export const videoSearchHistoryDriverAdapter = (usecase: VideoSearchHistoryUsecaseType) : VideoSearchHistoryDriverPort => ({

  items: (): SearchKeywordsType[] => {
    return usecase.items()
  },

  addOrUpdate : (keywords: SearchKeywordsType) => {
    usecase.addOrUpdate(keywords)
  },

  remove: (uid: string) => {
    usecase.remove(uid)
  },

  clear: () => {
    usecase.clear()
  }

})

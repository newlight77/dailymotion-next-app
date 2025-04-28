import { SearchKeywordsType } from "../domain";
import { VideoSearchHistoryDriverPort } from "../domain/port";
import { VideoSearchHistoryQueryType, VideoSearchHistoryUsecaseType } from '../domain/usecases'



export const videoSearchHistoryDriverAdapter = (usecase: VideoSearchHistoryUsecaseType, query: VideoSearchHistoryQueryType) : VideoSearchHistoryDriverPort => ({

  items: (): SearchKeywordsType[] => {
    return query.items()
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

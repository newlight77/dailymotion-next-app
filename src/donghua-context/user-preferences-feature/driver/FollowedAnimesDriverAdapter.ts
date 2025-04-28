import { FollowedAnimeType } from "../domain";
import { FollowedAnimesDriverPort } from "../domain/port";
import { FollowedAnimesQueryType, FollowedAnimesUsecaseType } from '../domain/usecases'



export const followedAnimesDriverAdapter = (usecase: FollowedAnimesUsecaseType, query: FollowedAnimesQueryType) : FollowedAnimesDriverPort => ({

  items: (): FollowedAnimeType[] => {
    return query.items()
  },

  remove: (uid: string) => {
    usecase.remove(uid)
  },

  addOrUpdate: (followed: FollowedAnimeType) => {
    usecase.addOrUpdate(followed)
  },

  load: (animes: FollowedAnimeType[]) => {
    usecase.load(animes)
  },

  clear: () => {
    usecase.clear()
  }

})

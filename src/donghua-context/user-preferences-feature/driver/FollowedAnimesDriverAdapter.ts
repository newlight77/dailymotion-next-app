import { FollowedAnimeType } from "../domain";
import { FollowedAnimesDriverPort } from "../domain/port";
import { FollowedAnimesUsecaseType } from '../domain/usecases'



export const followedAnimesDriverAdapter = (usecase: FollowedAnimesUsecaseType) : FollowedAnimesDriverPort => ({

  items: (): FollowedAnimeType[] => {
    return usecase.items()
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

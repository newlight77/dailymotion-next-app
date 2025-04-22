import { FollowedVideoOwnerType } from "../domain";
import { FollowedVideoOwnersDriverPort } from "../domain/port";
import { FollowedVideoOwnersUsecaseType } from '../domain/usecases'



export const followedVideoOwnersDriverAdapter = (usecase: FollowedVideoOwnersUsecaseType) : FollowedVideoOwnersDriverPort => ({

  items: (): FollowedVideoOwnerType[] => {
    return usecase.items()
  },

  remove: (uid: string) => {
    usecase.remove(uid)
  },

  addOrUpdate: (followed: FollowedVideoOwnerType) => {
    usecase.addOrUpdate(followed)
  },

  load: (animes: FollowedVideoOwnerType[]) => {
    usecase.load(animes)
  },

  reset: () => {
    usecase.reset()
  },

  clear: () => {
    usecase.clear()
  }

})

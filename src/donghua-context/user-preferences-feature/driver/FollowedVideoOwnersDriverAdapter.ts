import { FollowedVideoOwnerType } from "../domain";
import { FollowedVideoOwnersDriverPort } from "../domain/port";
import { FollowedVideoOwnersQueryType, FollowedVideoOwnersUsecaseType } from '../domain/usecases'



export const followedVideoOwnersDriverAdapter = (usecase: FollowedVideoOwnersUsecaseType, query: FollowedVideoOwnersQueryType) : FollowedVideoOwnersDriverPort => ({

  items: (): FollowedVideoOwnerType[] => {
    return query.items()
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

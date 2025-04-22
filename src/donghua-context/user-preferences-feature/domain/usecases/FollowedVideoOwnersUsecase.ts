import { FollowedVideoOwnerType } from "../model";
import { FollowedVideoOwnersDrivenPort } from "../port";


export type FollowedVideoOwnersUsecaseType = {
  items: () => FollowedVideoOwnerType[],
  addOrUpdate : (fav: FollowedVideoOwnerType) => void,
  remove : (uid: string) => void,
  load: (animes: FollowedVideoOwnerType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const followedVideoOwnersUsecase = (drivenPort: FollowedVideoOwnersDrivenPort) : FollowedVideoOwnersUsecaseType => {

  return {

    items: () => {
      return drivenPort.items()
    },

    addOrUpdate : (followed: FollowedVideoOwnerType) => {
      drivenPort.addOrUpdate(followed)
    },

    remove : (uid: string) => {
      drivenPort.remove(uid)
    },

    load: (owners: FollowedVideoOwnerType[]) => {
      drivenPort.load(owners)
    },

    reset: () => {
      return drivenPort.reset()
    },

    clear: () => {
      return drivenPort.clear()
    },
  }

}
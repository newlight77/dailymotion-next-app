import { FollowedAnimeType } from "../model";
import { FollowedAnimesDrivenPort } from "../port";


export type FollowedAnimesUsecaseType = {
  addOrUpdate : (fav: FollowedAnimeType) => void,
  remove : (uid: string) => void,
  load: (animes: FollowedAnimeType[]) => void,
  clear: () => void
}

export const followedAnimesUsecase = (drivenPort: FollowedAnimesDrivenPort) : FollowedAnimesUsecaseType => {

  return {

    addOrUpdate : (followed: FollowedAnimeType) => {
      drivenPort.addOrUpdate(followed)
    },

    remove : (uid: string) => {
      drivenPort.remove(uid)
    },

    load: (animes: FollowedAnimeType[]) => {
      drivenPort.load(animes)
    },

    clear: () => {
      drivenPort.clear()
    }
  }

}
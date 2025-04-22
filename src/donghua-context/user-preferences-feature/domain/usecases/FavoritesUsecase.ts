import { FavoriteType } from "../model";
import { FavoritesDrivenPort } from "../port";

export type FavoriteUsecaseType = {

  items: () => FavoriteType[],
  addOrUpdate : (fav: FavoriteType) => void,
  remove : (uid: string) => void,
  load: (fav: FavoriteType[]) => void,
  reset: () => void,
  clear: () => void,
}

export const favoriteUsecase = (drivenPort: FavoritesDrivenPort) : FavoriteUsecaseType => {

  return {

    items: () => {
      return drivenPort.items()
    },

    addOrUpdate : (fav: FavoriteType) => {
      drivenPort.addOrUpdate(fav)
    },

    remove : (uid: string) => {
      drivenPort.remove(uid)
    },

    load: (fav: FavoriteType[]) => {
      drivenPort.load(fav)
    },

    reset: () => {
      drivenPort.reset()
    },

    clear: () => {
      drivenPort.clear()
    },
  }

}

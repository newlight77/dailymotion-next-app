import { FavoriteType } from "../model";
import { FavoritesDrivenPort } from "../port";

export type FavoriteUsecaseType = {

  items: () => FavoriteType[],
  addOrUpdate : (fav: FavoriteType) => void,
  remove : (uid: string) => void
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
    }
  }

}

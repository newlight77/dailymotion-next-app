import { FavoriteType } from "../model";
import { FavoritesDrivenPort } from "../port";

export type FavoriteUsecaseType = {
  addOrUpdate : (fav: FavoriteType) => void,
  remove : (uid: string) => void,
  load: (fav: FavoriteType[]) => void,
  reset: () => void,
  clear: () => void,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const favoriteUsecase = (drivenPort: FavoritesDrivenPort) : FavoriteUsecaseType => {

  return {

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

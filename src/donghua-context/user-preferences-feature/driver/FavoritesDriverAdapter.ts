import { FavoriteType } from "../domain";
import { FavoritesDriverPort } from "../domain/port";
import { FavoriteUsecaseType } from '../domain/usecases'



export const favoritesDriverAdapter = (usecase: FavoriteUsecaseType) : FavoritesDriverPort => ({

  items: (): FavoriteType[] => {
    return usecase.items()
  },

  remove: (uid: string) => {
    usecase.remove(uid)
  },

  addOrUpdate: (fav: FavoriteType) => {
    usecase.addOrUpdate(fav)
  }

})

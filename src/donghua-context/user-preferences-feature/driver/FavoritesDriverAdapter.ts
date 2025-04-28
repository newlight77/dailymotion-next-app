import { FavoriteType } from "../domain";
import { FavoritesDriverPort } from "../domain/port";
import { FavoriteQueryType, FavoriteUsecaseType } from '../domain/usecases'



export const favoritesDriverAdapter = (usecase: FavoriteUsecaseType, query: FavoriteQueryType) : FavoritesDriverPort => ({

  items: (): FavoriteType[] => {
    return query.items()
  },

  remove: (uid: string) => {
    usecase.remove(uid)
  },

  addOrUpdate: (fav: FavoriteType) => {
    usecase.addOrUpdate(fav)
  },

  load: (fav: FavoriteType[]) => {
    usecase.load(fav)
  },

  reset: () => {
    usecase.reset()
  },

  clear: () => {
    usecase.clear()
  }

})

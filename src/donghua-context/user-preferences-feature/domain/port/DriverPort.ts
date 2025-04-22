import { FavoriteType } from "../model"

export type FavoritesDriverPort = {
  items: () => FavoriteType[],
  remove: (uid: string) => void,
  addOrUpdate: (fav: FavoriteType) => void
}

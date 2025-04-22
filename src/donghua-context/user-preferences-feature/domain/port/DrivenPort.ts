import { FavoriteType } from "../model"

export type FavoritesDrivenPort = {
  items: () => FavoriteType[],
  remove: (uid: string) => void,
  addOrUpdate: (fav: FavoriteType) => void
}

import { useFavorites } from "../../hooks";
import { FavoriteType } from "../model";

export const FavoriteUsecase = {
  addOrUpdate: (fav: FavoriteType) => {
    const useFavorite = useFavorites();
    useFavorite.addOrUpdate(fav)
  },
  remove: (uid: string) => {
    const useFavorite = useFavorites();
    useFavorite.remove(uid)
  }
}
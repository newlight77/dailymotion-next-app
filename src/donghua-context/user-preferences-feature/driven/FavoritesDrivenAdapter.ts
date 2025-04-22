import { useStorage } from "@/shared/useStorage";
import { FavoriteType } from "../domain/model";
import { FavoritesDrivenPort } from "../domain/port";



export const favoritesDrivenAdapter = (): FavoritesDrivenPort => {

  const {item, items, remove, addOrUpdate, loadData, reset, clear} = useStorage<FavoriteType>(`favorites`, []);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate: (fav: FavoriteType) => {
      addOrUpdate(fav)
    },

    remove: (uid: string) => {
      remove(uid)
    }

  }
}
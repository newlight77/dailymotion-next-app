'use client'
import { useStorage } from "@/shared/useStorage";
import { FavoriteType } from "../domain/model";
import { FavoritesDrivenPort } from "../domain/port";



export const useFavoritesDrivenAdapter = (): FavoritesDrivenPort => {

  const {items, remove, addOrUpdate, loadData, clear} = useStorage<FavoriteType>(`favorites`, []);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate: (fav: FavoriteType) => {
      addOrUpdate(fav)
    },

    remove: (uid: string) => {
      remove(uid)
    },

    load: (fav: FavoriteType[]) => {
      loadData(fav)
    },

    reset: () => {
      clear()
    },

    clear: () => {
      clear()
    }

  }
}
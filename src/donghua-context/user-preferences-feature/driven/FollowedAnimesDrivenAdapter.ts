'use client'
import { useStorage } from "@/core/core-lib/shared/useStorage";
import { FollowedAnimeType } from "../domain/model";
import { FollowedAnimesDrivenPort } from "../domain/port";



export const useFollowedAnimesDrivenAdapter = (): FollowedAnimesDrivenPort => {

  const {items, remove, addOrUpdate, loadData, clear} = useStorage<FollowedAnimeType>(`followed-animes`, []);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate: (followed: FollowedAnimeType) => {
      addOrUpdate(followed)
    },

    remove: (uid: string) => {
      remove(uid)
    },

    load: (animes: FollowedAnimeType[]) => {
      loadData(animes)
    },

    clear: () => {
      clear()
    }

  }
}
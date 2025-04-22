'use client'
import { useStorage } from "@/shared/useStorage";
import { FollowedVideoOwnerType } from "../domain/model";
import { FollowedVideoOwnersDrivenPort } from "../domain/port";



export const useFollowedVideoAnimesDrivenAdapter = (): FollowedVideoOwnersDrivenPort => {

  const {items, remove, addOrUpdate, loadData, reset, clear } = useStorage<FollowedVideoOwnerType>(`followed-video-owners`, []);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate: (followed: FollowedVideoOwnerType) => {
      addOrUpdate(followed)
    },

    remove: (uid: string) => {
      remove(uid)
    },

    load: (animes: FollowedVideoOwnerType[]) => {
      loadData(animes)
    },

    reset: () => {
      reset()
    },

    clear: () => {
      clear()
    },

  }
}
'use client'
import { useStorage } from "@/core/core-lib/shared/useStorage";
import { LastViewType } from "../domain/model";
import { LastViewsDrivenPort } from "../domain/port";



export const useLastViewsDrivenAdapter = (): LastViewsDrivenPort => {

  const {items, addOrUpdate, remove, clear} = useStorage<LastViewType>(`last-views`, []);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate : (lastView: LastViewType) => {
      addOrUpdate(lastView)
    },

    remove: (uid: string) => {
      remove(uid)
    },

    clear: () => {
      clear()
    },

  }
}
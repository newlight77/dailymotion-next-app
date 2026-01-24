'use client'
import { useStorage } from "@/core/core-lib/shared/useStorage";
import { SearchKeywordsType } from "../domain/model";
import { VideoSearchHistoryDrivenPort } from "../domain/port";



export const useVideoSearchHistoryDrivenAdapter = (): VideoSearchHistoryDrivenPort => {

  const {items, addOrUpdate, remove, clear} = useStorage<SearchKeywordsType>(`search-history`, []);

  return {
    items: () => {
      return items || []
    },

    addOrUpdate : (keywords: SearchKeywordsType) => {
      addOrUpdate(keywords)
    },

    remove: (uid: string) => {
      remove(uid)
    },

    clear: () => {
      clear()
    },

  }
}
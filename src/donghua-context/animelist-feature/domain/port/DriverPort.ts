import { AnimeType } from "../model"

export interface AnimeListDriverPort {
  upsert: (anime: AnimeType) => Promise<AnimeType | undefined>
  findById: (id: string) => Promise<AnimeType | undefined>
  items: () => AnimeType[]
  load: (fav: AnimeType[]) => void
  reset: () => void
}

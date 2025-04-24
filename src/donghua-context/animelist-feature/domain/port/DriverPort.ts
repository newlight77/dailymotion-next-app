import { AnimeType } from "../model"

export interface AnimeListDriverPort {
  findById: (id: string) => Promise<AnimeType | undefined>
  items: () => AnimeType[]
  upsert: (anime: AnimeType) => Promise<AnimeType | undefined>
  load: (fav: AnimeType[]) => void
  reset: () => void
}

import { AnimeType } from "../model"

export interface AnimeListDrivenPort {
  upsert: (anime: AnimeType) => Promise<AnimeType |undefined>
  findById: (id: string) => Promise<AnimeType | undefined>
  findAll: () => Promise<AnimeType[]>
  items: () => AnimeType[]
  addOrUpdate: (fav: AnimeType) => void
  load: (fav: AnimeType[]) => void
  reset: () => void
}

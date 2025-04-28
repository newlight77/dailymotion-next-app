import { AnimeType } from "../model"

export interface AnimeListDrivenPort {
  findById: (id: string) => Promise<AnimeType | undefined>
  findAll: () => Promise<AnimeType[]>
  items: () => AnimeType[]
  upsert: (anime: AnimeType) => Promise<AnimeType |undefined>
  addOrUpdate: (fav: AnimeType) => void
  load: (fav: AnimeType[]) => void
  reset: () => void
}

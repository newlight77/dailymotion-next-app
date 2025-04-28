import { AnimeType } from "../model"

export interface AnimeListDrivenWritePort {
  upsert: (anime: AnimeType) => Promise<AnimeType |undefined>
  addOrUpdate: (fav: AnimeType) => void
  load: (fav: AnimeType[]) => void
  reset: () => void
}

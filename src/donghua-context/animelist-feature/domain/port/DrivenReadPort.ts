import { AnimeType } from "../model"

export interface AnimeListDrivenReadPort {
  findById: (id: string) => Promise<AnimeType | undefined>
  findAll: () => Promise<AnimeType[]>
  items: () => AnimeType[]
}

import { AnimeType } from "../model"

export interface AnimeListPort {
  upsert: (anime: AnimeType) => Promise<AnimeType |undefined>
  findById: (id: string) => Promise<AnimeType | undefined>
  findAll: () => Promise<AnimeType[]>
}

export interface AnimeListUsecasePort {
  upsert: (anime: AnimeType) => Promise<AnimeType | undefined>
  findById: (id: string) => Promise<AnimeType | undefined>
  findAll: () => Promise<AnimeType[]>
}

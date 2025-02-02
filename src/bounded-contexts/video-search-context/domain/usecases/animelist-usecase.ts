import { AnimeType } from "@/bounded-contexts/video-search-context/domain/model/anime";


export interface AnimeListPort {
  upsert: (anime: AnimeType) => Promise<void>
  findById: (id: string) => Promise<AnimeType | undefined>
  findAll: () => Promise<AnimeType[]>
}

// export const AnimeListUsecase = (port: AnimeListPort) => {

//   const findById = async (uid: string): Promise<AnimeType | undefined> => {
//     return await port.findById(uid);
//   }

//   const findAll = async (): Promise<AnimeType[]> => {
//     return await port.findAll();
//   }

//   return {
//     findAll,
//     findById
//   }
// }

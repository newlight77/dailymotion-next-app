import { AnimeType } from "../model";
import { AnimeListPort, AnimeListUsecasePort } from "../port";


export const AnimeListUsecase = (port: AnimeListPort): AnimeListUsecasePort => {

  const upsert = async (anime: AnimeType): Promise<AnimeType | undefined> => {
    return await port.upsert(anime)
  }

  const findById = async (uid: string): Promise<AnimeType | undefined> => {
    // console.log('AnimeListUsecase findById:', uid);
    return await port.findById(uid);
  }

  const findAll = async (): Promise<AnimeType[]> => {
    // console.log('AnimeListUsecase findAll:', port.findAll());
    return await port.findAll();
  }

  return {
    upsert,
    findAll,
    findById
  }
}

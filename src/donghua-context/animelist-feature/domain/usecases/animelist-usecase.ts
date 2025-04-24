import { AnimeType } from "../model";
import { AnimeListDrivenPort } from "../port";


export type AnimeListUsecaseType = {
  upsert: (anime: AnimeType) => Promise<AnimeType | undefined>,
  findById: (uid: string) => Promise<AnimeType | undefined>,
  findAll: () => Promise<AnimeType[]>,
  items: () => AnimeType[],
  load: (list: AnimeType[]) => void,
  reset: () => void
}

export const animeListUsecase = (drivenPort: AnimeListDrivenPort): AnimeListUsecaseType => {

  const upsert = async (anime: AnimeType): Promise<AnimeType | undefined> => {
    // console.log('AnimeListConfigurator before upsert', anime);
    const result = await drivenPort.upsert(anime);
    if (!result) {
      console.error('failed to upsert anime', anime)
      return
    }
    drivenPort.addOrUpdate(anime)
    // console.log('AnimeListConfigurator post upsert', items)
  }

  const findById = async (uid: string): Promise<AnimeType | undefined> => {
    // console.log('AnimeListUsecase findById:', uid);
    return await drivenPort.findById(uid);
  }

  const findAll = async (): Promise<AnimeType[]> => {
    // console.log('AnimeListUsecase findAll:', port.findAll());
    return await drivenPort.findAll();
  }

  const items = (): AnimeType[] => {
    return drivenPort.items()
  }

  const load = (list: AnimeType[]) => {
    // console.log('AnimeListConfigurator reset', all);
    drivenPort.load(list);
  }

  const reset = async () => {
    const all = await drivenPort.findAll();
    // console.log('AnimeListConfigurator reset', all);
    drivenPort.load(all);
  }

  return {
    upsert,
    findAll,
    findById,
    items,
    load,
    reset
  }
}

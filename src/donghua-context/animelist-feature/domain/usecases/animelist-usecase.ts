import { AnimeType } from "../model";
import { AnimeListDrivenPort } from "../port";


export type AnimeListUsecaseType = {
  upsert: (anime: AnimeType) => Promise<AnimeType | undefined>,
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
    load,
    reset
  }
}

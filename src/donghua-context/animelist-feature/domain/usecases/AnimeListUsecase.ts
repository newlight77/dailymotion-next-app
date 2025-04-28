import { AnimeType } from "../model";
import { AnimeListDrivenReadPort, AnimeListDrivenWritePort } from "../port";


export type AnimeListUsecaseType = {
  upsert: (anime: AnimeType) => Promise<AnimeType | undefined>,
  load: (list: AnimeType[]) => void,
  reset: () => void
}

export const animeListUsecase = (drivenReadPort: AnimeListDrivenReadPort, drivenWritePort: AnimeListDrivenWritePort): AnimeListUsecaseType => {

  const upsert = async (anime: AnimeType): Promise<AnimeType | undefined> => {
    // console.log('AnimeListConfigurator before upsert', anime);
    const result = await drivenWritePort.upsert(anime);
    if (!result) {
      console.error('failed to upsert anime', anime)
      return
    }
    drivenWritePort.addOrUpdate(anime)
    // console.log('AnimeListConfigurator post upsert', items)
  }

  const load = (list: AnimeType[]) => {
    // console.log('AnimeListConfigurator reset', all);
    drivenWritePort.load(list);
  }

  const reset = async () => {
    const all = await drivenReadPort.findAll();
    // console.log('AnimeListConfigurator reset', all);
    drivenWritePort.load(all);
  }

  return {
    upsert,
    load,
    reset
  }
}

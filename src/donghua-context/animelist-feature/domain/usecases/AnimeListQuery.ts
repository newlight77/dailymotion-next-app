import { AnimeType } from "../model";
import { AnimeListDrivenReadPort } from "../port";


export type AnimeListQueryType = {
  findById: (uid: string) => Promise<AnimeType | undefined>,
  items: () => AnimeType[],
}

export const animeListQuery = (drivenPort: AnimeListDrivenReadPort): AnimeListQueryType => {

  const findById = async (uid: string): Promise<AnimeType | undefined> => {
    // console.log('AnimeListUsecase findById:', uid);
    return await drivenPort.findById(uid);
  }

  const items = (): AnimeType[] => {
    return drivenPort.items()
  }

  return {
    findById,
    items,
  }
}

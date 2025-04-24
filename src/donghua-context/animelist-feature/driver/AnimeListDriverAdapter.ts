import { AnimeType } from '../domain/model';
import { AnimeListDriverPort } from '../domain/port'
import { AnimeListUsecaseType } from '../domain/usecases'



export const animeListDriverAdapter = (usecase: AnimeListUsecaseType) : AnimeListDriverPort => ({

  upsert: async (anime: AnimeType): Promise<AnimeType | undefined> => {
    return await usecase.upsert(anime)
  },

  findById: async (uid: string): Promise<AnimeType | undefined> => {
    // console.log('AnimeListUsecase findById:', uid);
    return await usecase.findById(uid);
  },

  items: (): AnimeType[] => {
    return usecase.items()
  },

  load: (fav: AnimeType[]) => {
    usecase.load(fav)
  },

  reset: () => {
    usecase.reset()
  },

})

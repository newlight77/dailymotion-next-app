import { AnimeType } from '../domain/model';
import { AnimeListDriverPort } from '../domain/port'
import { AnimeListUsecaseType, AnimeListQueryType } from '../domain/usecases'



export const animeListDriverAdapter = (usecase: AnimeListUsecaseType, query: AnimeListQueryType) : AnimeListDriverPort => ({

  findById: async (uid: string): Promise<AnimeType | undefined> => {
    // console.log('AnimeListUsecase findById:', uid);
    return await query.findById(uid);
  },

  items: (): AnimeType[] => {
    return query.items()
  },

  upsert: async (anime: AnimeType): Promise<AnimeType | undefined> => {
    return await usecase.upsert(anime)
  },

  load: (fav: AnimeType[]) => {
    usecase.load(fav)
  },

  reset: () => {
    usecase.reset()
  },

})

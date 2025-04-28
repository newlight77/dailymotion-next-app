import { PreferencesType, VideoSearchParamsType, VideoSearchWithScoreResponse, VideoType } from "../domain";
import { VideoSearchDriverPort } from "../domain/port";
import type { VideoSearchUseCaseType, VideoSearchQueryType } from "../domain/usecases";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const videoSearchDriverAdapter = (usecase: VideoSearchUseCaseType, query: VideoSearchQueryType) : VideoSearchDriverPort => ({

  getById: async (uid: string): Promise<VideoType | undefined> => {
    // console.log('AnimeListUsecase findById:', uid);
    return await query.getById(uid);
  },

  search: async (searchParams: VideoSearchParamsType, prefs?: PreferencesType): Promise<VideoSearchWithScoreResponse> => {

    return await usecase.search(searchParams, prefs);
  }

})

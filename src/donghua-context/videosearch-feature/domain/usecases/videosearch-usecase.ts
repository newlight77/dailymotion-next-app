import { FollowedAnimeType, FollowedVideoOwnerType, MetaVideoType, PreferencesType } from "../model";
import { VideoSearchParamsType, VideoSearchWithScoreResponse, VideoType, VideoWithScoreType } from "../model";
import { VideoSearchDrivenPort } from "../port";


export type VideoSearchUseCaseType = {
  search: (searchParams: VideoSearchParamsType, prefs?: PreferencesType) => Promise<VideoSearchWithScoreResponse>,
  getById: (id: string) => Promise<VideoType | undefined>
}

export const videoSearchUsecase = (port: VideoSearchDrivenPort): VideoSearchUseCaseType => {

  // this is a query use case
  const search = async (searchParams: VideoSearchParamsType, prefs?: PreferencesType): Promise<VideoSearchWithScoreResponse> => {
    const response = await port.search(searchParams);

    const { list } = response;
    let scoredList: VideoWithScoreType[] = []

    const strictValue = prefs?.strictSearch ? 0 : 1

    if (prefs) {
      // Reorder the results based on user preferences
      scoredList = list.map((video: MetaVideoType) => scoreVideo(video, searchParams.search, prefs)).map(v => v as VideoWithScoreType)
      scoredList = scoredList
        .sort((a, b) => b.score - a.score)
        .filter(v => v.score >= searchParams.search.split(" ").length - strictValue)
        .map(v => v as VideoWithScoreType)
    }

    return {
      ...response,
      list: scoredList
    };
  }

  // this is a query use case
  const getById = async (id: string): Promise<VideoType | undefined> => {
    return await port.getById(id)
  }

  return {
    search,
    getById
  }
}


// TODO : move to model associate to VideoWithScoreType
const scoreVideo = ( video: MetaVideoType, keywords: string, prefs: PreferencesType) : VideoWithScoreType => {
  const { followedAnimes, followedOwners } = prefs;

  const scoreFollowedAnimeMatched = (video: MetaVideoType, followedAnimes?: FollowedAnimeType[]): number => {
    const results = followedAnimes?.filter(f => f.title.toLocaleLowerCase() === video.title.toLocaleLowerCase())
    return results?.length === 1 ? 10 : 0
  }

  const scoreFollowedOwnerMatched = (video: MetaVideoType, followedOwners?: FollowedVideoOwnerType[]): number => {
    const results = followedOwners?.filter(f => f.owner.toLocaleLowerCase() === video.ownerUsername.toLocaleLowerCase())
    return results?.length === 1 ? 5 : 0
  }

  const scoreSearchKeywordsMatched = (video: MetaVideoType, keywords: string) : number => {
    let score = 0
    keywords.split(" ").forEach((w) => {
      if (video.title.toLocaleLowerCase().includes(w.toLocaleLowerCase())) score += 1
    })

    return score
  }

  let score = 0;
  score += scoreFollowedAnimeMatched(video, followedAnimes)
  score += scoreFollowedOwnerMatched(video, followedOwners)
  score += scoreSearchKeywordsMatched(video, keywords)
  return { ...video, score };
}

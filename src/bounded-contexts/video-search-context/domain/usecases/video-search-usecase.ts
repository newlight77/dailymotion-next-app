import { FavoriteType, FollowedAnimeType, FollowedVideoOwnerType, LastViewType, MetaVideoType, SearchKeywordsType, VideoType } from "@/bounded-contexts/video-search-context/domain/model/anime";

export type PreferencesType = {
  strictSearch: boolean,
  followedAnimes?: FollowedAnimeType[], // Array of followed anime IDs
  followedOwners?: FollowedVideoOwnerType[], // Array of followed owner usernames
  lastViews?: LastViewType[] // Array of last search keywords
  favorites?: FavoriteType[], // Array of favorite video IDs
  lastSearches?: SearchKeywordsType[] // Array of last search keywords
}

export type VideoSearchResponse = {
  search: string,
  page: number,
  limit: number,
  list: MetaVideoType[],
  hasMore: boolean,
}

export type VideoSearchWithScoreResponse = {
  search: string,
  page: number,
  limit: number,
  list: VideoWithScoreType[],
  hasMore: boolean,
}

export type VideoWithScoreType = MetaVideoType & { score: number}

export type VideoSearchParamsType = {
  search: string,
  limit: number,
  page: number,
};

export interface VideoSearchPort {
  search: (searchParams: VideoSearchParamsType) => Promise<VideoSearchResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}

export interface VideoSearchUsecasePort {
  search: (searchParams: VideoSearchParamsType, prefs?: PreferencesType) => Promise<VideoSearchWithScoreResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}

export const VideoSearchUsecase = (port: VideoSearchPort): VideoSearchUsecasePort => {

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

  const getById = async (id: string): Promise<VideoType | undefined> => {
    return await port.getById(id)
  }

  return {
    search,
    getById
  }
}

const scoreVideo = ( video: MetaVideoType, keywords: string, prefs: PreferencesType) : VideoWithScoreType => {
  const { followedAnimes, followedOwners } = prefs;

  let score = 0;
  score += scoreFollowedAnimeMatched(video, followedAnimes)
  score += scoreFollowedOwnerMatched(video, followedOwners)
  score += scoreSearchKeywordsMatched(video, keywords)
  return { ...video, score };
}

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
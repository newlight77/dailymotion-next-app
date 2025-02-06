import { FavoriteType, FollowedAnimeType, FollowedVideoOwnerType, LastViewType, MetaVideoType, SearchKeywordsType, VideoType } from "@/bounded-contexts/video-search-context/domain/model/anime";

export type PreferencesType = {
  followedAnimes?: FollowedAnimeType[], // Array of followed anime IDs
  lastViews?: LastViewType[] // Array of last search keywords
  favorites?: FavoriteType[], // Array of favorite video IDs
  followedOwners?: FollowedVideoOwnerType[], // Array of followed owner usernames
  lastSearches?: SearchKeywordsType[] // Array of last search keywords
}

export type VideoSearchResponse = {
  search: string,
  page: number,
  limit: number,
  list: MetaVideoType[],
  hasMore: boolean,
}

type VideoWithScoreType = MetaVideoType & { score: number}

export type VideoSearchParamsType = {
  search: string,
  limit: number,
  page: number,
};

export interface VideoSearchPort {
  search: (searchParams: VideoSearchParamsType, prefs?: PreferencesType) => Promise<VideoSearchResponse>
  getById: (id: string) => Promise<VideoType | undefined>
}

export const VideoSearchUsecase = (port: VideoSearchPort) => {

  const search = async (searchParams: VideoSearchParamsType, prefs?: PreferencesType): Promise<VideoSearchResponse> => {
    const response = await port.search(searchParams);

    let { list } = response;

    if (prefs) {
      // Reorder the results based on user preferences
      const scoredList = list.map((video: MetaVideoType) => scoreVideo(video, searchParams.search, prefs));
      list = scoredList.sort((a, b) => b.score - a.score).map(v => v as MetaVideoType)
    }

    return {
      ...response,
      list: list
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

const scoreVideo = ( video: MetaVideoType, searchKeywords: string, prefs: PreferencesType) : VideoWithScoreType => {
  const { followedAnimes, lastViews, favorites, followedOwners, lastSearches } = prefs;

  let score = 0;
  if (followedAnimes && followedAnimeMatched(followedAnimes, video)) score += 10;
  if (lastViews && lastviewMatched(lastViews, video)) score += 7;
  if (favorites && favoriteMatched(favorites, video)) score += 5;
  if (followedOwners && followedOwnerMatched(followedOwners, video)) score += 3;
  if (lastSearches && lastSearcheMatch(lastSearches, searchKeywords)) score += 1;

  return { ...video, score };
}

const followedAnimeMatched = (followedAnimes: FollowedAnimeType[], video: MetaVideoType): boolean => {
    const results = followedAnimes.filter(f => f.title === video.title)
    return results?.length === 1
}

const lastviewMatched = (lastviews: LastViewType[], video: MetaVideoType): boolean => {
  const results = lastviews.filter(f => f.title === video.title)
  return results?.length === 1
}

const favoriteMatched = (favorites: FavoriteType[], video: MetaVideoType): boolean => {
    const results = favorites.filter(f => f.title === video.title)
    return results?.length === 1
}

const followedOwnerMatched = (followedOwners: FollowedVideoOwnerType[], video: MetaVideoType): boolean => {
  const results = followedOwners.filter(f => f.owner === video.ownerUsername)
  return results?.length === 1
}

const lastSearcheMatch = (lastSearches: SearchKeywordsType[], searchKeywords: string): boolean => {
  const results = lastSearches.filter(f => f.keywords.includes(searchKeywords) || searchKeywords.includes(f.keywords))
  return results?.length === 1
}
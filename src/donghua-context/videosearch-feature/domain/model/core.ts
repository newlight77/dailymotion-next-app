import { MetaVideoType, PreferencesType, VideoWithScoreType, FollowedAnimeType, FollowedVideoOwnerType } from "./types";

// TODO : move to model associate to VideoWithScoreType
export const scoreVideo = ( video: MetaVideoType, keywords: string, prefs: PreferencesType) : VideoWithScoreType => {
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
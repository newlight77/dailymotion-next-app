import { MetaVideoType, PreferencesType, VideoWithScoreType, FollowedVideoOwnerType } from "./types";

// TODO : move to model associate to VideoWithScoreType
export const scoreVideo = ( video: MetaVideoType, keywords: string, prefs: PreferencesType) : VideoWithScoreType => {
  const { followedOwners } = prefs;

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
  score += scoreFollowedOwnerMatched(video, followedOwners)
  score += scoreSearchKeywordsMatched(video, keywords)
  return { ...video, score };
}
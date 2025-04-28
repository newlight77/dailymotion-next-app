import { FollowedAnimeType } from "../model";
import { FollowedAnimesDrivenPort } from "../port";


export type FollowedAnimesQueryType = {
  items: () => FollowedAnimeType[],
}

export const followedAnimesQuery = (drivenPort: FollowedAnimesDrivenPort) : FollowedAnimesQueryType => {

  return {

    items: () => {
      return drivenPort.items()
    },

  }

}
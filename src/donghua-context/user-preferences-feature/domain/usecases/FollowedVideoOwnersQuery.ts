import { FollowedVideoOwnerType } from "../model";
import { FollowedVideoOwnersDrivenPort } from "../port";


export type FollowedVideoOwnersQueryType = {
  items: () => FollowedVideoOwnerType[],
}

export const followedVideoOwnersQuery = (drivenPort: FollowedVideoOwnersDrivenPort) : FollowedVideoOwnersQueryType => {

  return {

    items: () => {
      return drivenPort.items()
    },
  }

}
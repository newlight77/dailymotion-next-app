import { useFollowedVideoOwners } from "../../hooks";
import { FollowedVideoOwnerType } from "../model";

export const FollowedVideoOwnersUsecase = {
  addOrUpdate: (followed: FollowedVideoOwnerType) => {
    const useFollowedVideoOwner = useFollowedVideoOwners();
    useFollowedVideoOwner.addOrUpdate(followed)
  },
  remove: (uid: string) => {
    const useFollowedVideoOwner = useFollowedVideoOwners();
    useFollowedVideoOwner.remove(uid)
  }
}
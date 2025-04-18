import { useFollowedAnimes } from "../../hooks";
import { FollowedAnimeType } from "../model";

export const FollowedAnimesUsecase = {
  addOrUpdate: (followed: FollowedAnimeType) => {
    const useFollowedAnime = useFollowedAnimes();
    useFollowedAnime.addOrUpdate(followed)
  },
  remove: (uid: string) => {
    const useFollowedAnime = useFollowedAnimes();
    useFollowedAnime.remove(uid)
  }
}
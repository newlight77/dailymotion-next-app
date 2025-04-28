import { FavoriteType } from "../model";
import { FavoritesDrivenPort } from "../port";

export type FavoriteQueryType = {
  items: () => FavoriteType[],
}

export const favoriteQuery = (drivenPort: FavoritesDrivenPort) : FavoriteQueryType => {

  return {
    items: () => {
      return drivenPort.items()
    }
  }

}

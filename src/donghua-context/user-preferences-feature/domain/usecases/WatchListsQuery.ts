import { WatchListItemType, WatchListType } from "../model";
import { WatchListsDrivenPort } from "../port";

export type WatchListsQueryType = {
  lists: () => WatchListType[],
  items: () => WatchListItemType[],
}

export const watchListsQuery = (drivenPort: WatchListsDrivenPort): WatchListsQueryType => {
  return {
    lists: () => drivenPort.lists(),
    items: () => drivenPort.items(),
  }
}

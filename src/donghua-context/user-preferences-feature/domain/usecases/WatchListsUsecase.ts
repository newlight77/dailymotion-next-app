import { AnimeType } from "@/donghua-context/animelist-feature";
import { WatchListItemType, WatchListType } from "../model";
import { WatchListsDrivenPort } from "../port";

export type WatchListsUsecaseType = {
  loadLists: () => Promise<WatchListType[] | undefined>,
  createList: (title: string) => Promise<WatchListType | undefined>,
  renameList: (listId: string, title: string) => Promise<WatchListType | undefined>,
  setListVisibility: (listId: string, isPublic: boolean) => Promise<WatchListType | undefined>,
  deleteList: (listId: string) => Promise<void>,
  loadListItems: (listId: string) => Promise<(WatchListType & { items: WatchListItemType[] }) | undefined>,
  addAnime: (listId: string, anime: AnimeType) => Promise<WatchListItemType | undefined>,
  removeAnime: (listId: string, animeId: string) => Promise<void>,
  clear: () => void
}

export const watchListsUsecase = (drivenPort: WatchListsDrivenPort): WatchListsUsecaseType => {
  const loadLists = async (): Promise<WatchListType[] | undefined> => {
    const lists = await drivenPort.fetchLists();
    if (lists) {
      drivenPort.loadLists(lists);
    }
    return lists;
  }

  const createList = async (title: string): Promise<WatchListType | undefined> => {
    const list = await drivenPort.createList(title);
    if (list) {
      drivenPort.addOrUpdateList(list);
    }
    return list;
  }

  const renameList = async (listId: string, title: string): Promise<WatchListType | undefined> => {
    const list = await drivenPort.renameList(listId, title);
    if (list) {
      drivenPort.addOrUpdateList(list);
    }
    return list;
  }

  const setListVisibility = async (listId: string, isPublic: boolean): Promise<WatchListType | undefined> => {
    const list = await drivenPort.setListVisibility(listId, isPublic);
    if (list) {
      drivenPort.addOrUpdateList(list);
    }
    return list;
  }

  const deleteList = async (listId: string): Promise<void> => {
    await drivenPort.deleteList(listId);
    drivenPort.removeList(listId);
  }

  const loadListItems = async (listId: string): Promise<(WatchListType & { items: WatchListItemType[] }) | undefined> => {
    const list = await drivenPort.fetchList(listId);
    if (list?.items) {
      drivenPort.loadItems(list.items);
    }
    return list;
  }

  const addAnime = async (listId: string, anime: AnimeType): Promise<WatchListItemType | undefined> => {
    const item = await drivenPort.addAnime(listId, anime);
    if (item) {
      drivenPort.addOrUpdateItem(item);
    }
    return item;
  }

  const removeAnime = async (listId: string, animeId: string): Promise<void> => {
    await drivenPort.removeAnime(listId, animeId);
    drivenPort.removeItemByAnimeId(animeId);
  }

  const clear = () => {
    drivenPort.clear();
  }

  return {
    loadLists,
    createList,
    renameList,
    setListVisibility,
    deleteList,
    loadListItems,
    addAnime,
    removeAnime,
    clear,
  }
}

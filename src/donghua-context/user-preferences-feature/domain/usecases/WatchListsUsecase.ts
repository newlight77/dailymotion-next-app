import { AnimeType } from "@/donghua-context/animelist-feature";
import { WatchListCollectionType, WatchListItemType, WatchListType } from "../model";
import { WatchListsDrivenPort } from "../port";

export type WatchListsUsecaseType = {
  loadCollection: (collectionId: string) => Promise<WatchListCollectionType | undefined>,
  createCollection: () => Promise<WatchListCollectionType | undefined>,
  createList: (collectionId: string, title: string) => Promise<WatchListType | undefined>,
  renameList: (collectionId: string, listId: string, title: string) => Promise<WatchListType | undefined>,
  deleteList: (collectionId: string, listId: string) => Promise<void>,
  loadListItems: (collectionId: string, listId: string) => Promise<(WatchListType & { items: WatchListItemType[] }) | undefined>,
  addAnime: (collectionId: string, listId: string, anime: AnimeType) => Promise<WatchListItemType | undefined>,
  removeAnime: (collectionId: string, listId: string, animeId: string) => Promise<void>,
  clear: () => void
}

export const watchListsUsecase = (drivenPort: WatchListsDrivenPort): WatchListsUsecaseType => {
  const loadCollection = async (collectionId: string): Promise<WatchListCollectionType | undefined> => {
    const collection = await drivenPort.fetchCollection(collectionId);
    if (collection?.lists) {
      drivenPort.loadLists(collection.lists);
    }
    return collection;
  }

  const createCollection = async (): Promise<WatchListCollectionType | undefined> => {
    const collection = await drivenPort.createCollection();
    if (collection?.lists) {
      drivenPort.loadLists(collection.lists);
    } else {
      drivenPort.loadLists([]);
    }
    return collection;
  }

  const createList = async (collectionId: string, title: string): Promise<WatchListType | undefined> => {
    const list = await drivenPort.createList(collectionId, title);
    if (list) {
      drivenPort.addOrUpdateList(list);
    }
    return list;
  }

  const renameList = async (collectionId: string, listId: string, title: string): Promise<WatchListType | undefined> => {
    const list = await drivenPort.renameList(collectionId, listId, title);
    if (list) {
      drivenPort.addOrUpdateList(list);
    }
    return list;
  }

  const deleteList = async (collectionId: string, listId: string): Promise<void> => {
    await drivenPort.deleteList(collectionId, listId);
    drivenPort.removeList(listId);
  }

  const loadListItems = async (collectionId: string, listId: string): Promise<(WatchListType & { items: WatchListItemType[] }) | undefined> => {
    const list = await drivenPort.fetchList(collectionId, listId);
    if (list?.items) {
      drivenPort.loadItems(list.items);
    }
    return list;
  }

  const addAnime = async (collectionId: string, listId: string, anime: AnimeType): Promise<WatchListItemType | undefined> => {
    const item = await drivenPort.addAnime(collectionId, listId, anime);
    if (item) {
      drivenPort.addOrUpdateItem(item);
    }
    return item;
  }

  const removeAnime = async (collectionId: string, listId: string, animeId: string): Promise<void> => {
    await drivenPort.removeAnime(collectionId, listId, animeId);
    drivenPort.removeItemByAnimeId(animeId);
  }

  const clear = () => {
    drivenPort.clear();
  }

  return {
    loadCollection,
    createCollection,
    createList,
    renameList,
    deleteList,
    loadListItems,
    addAnime,
    removeAnime,
    clear,
  }
}

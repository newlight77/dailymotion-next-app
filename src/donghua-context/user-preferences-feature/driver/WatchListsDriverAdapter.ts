import { AnimeType } from "@/donghua-context/animelist-feature";
import { WatchListCollectionType, WatchListItemType, WatchListType } from "../domain";
import { WatchListsDriverPort } from "../domain/port";
import { WatchListsQueryType, WatchListsUsecaseType } from "../domain/usecases";

export const watchListsDriverAdapter = (
  usecase: WatchListsUsecaseType,
  query: WatchListsQueryType
): WatchListsDriverPort => ({
  lists: (): WatchListType[] => query.lists(),
  items: (): WatchListItemType[] => query.items(),

  loadCollection: (collectionId: string): Promise<WatchListCollectionType | undefined> => {
    return usecase.loadCollection(collectionId);
  },

  createCollection: (): Promise<WatchListCollectionType | undefined> => {
    return usecase.createCollection();
  },

  createList: (collectionId: string, title: string): Promise<WatchListType | undefined> => {
    return usecase.createList(collectionId, title);
  },

  renameList: (collectionId: string, listId: string, title: string): Promise<WatchListType | undefined> => {
    return usecase.renameList(collectionId, listId, title);
  },

  deleteList: (collectionId: string, listId: string): Promise<void> => {
    return usecase.deleteList(collectionId, listId);
  },

  loadListItems: (collectionId: string, listId: string): Promise<(WatchListType & { items: WatchListItemType[] }) | undefined> => {
    return usecase.loadListItems(collectionId, listId);
  },

  addAnime: (collectionId: string, listId: string, anime: AnimeType): Promise<WatchListItemType | undefined> => {
    return usecase.addAnime(collectionId, listId, anime);
  },

  removeAnime: (collectionId: string, listId: string, animeId: string): Promise<void> => {
    return usecase.removeAnime(collectionId, listId, animeId);
  },

  clear: () => {
    usecase.clear();
  }
});

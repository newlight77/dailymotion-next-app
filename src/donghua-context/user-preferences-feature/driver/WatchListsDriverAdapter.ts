import { AnimeType } from "@/donghua-context/animelist-feature";
import { WatchListItemType, WatchListType } from "../domain";
import { WatchListsDriverPort } from "../domain/port";
import { WatchListsQueryType, WatchListsUsecaseType } from "../domain/usecases";

export const watchListsDriverAdapter = (
  usecase: WatchListsUsecaseType,
  query: WatchListsQueryType
): WatchListsDriverPort => ({
  lists: (): WatchListType[] => query.lists(),
  items: (): WatchListItemType[] => query.items(),

  loadLists: (): Promise<WatchListType[] | undefined> => {
    return usecase.loadLists();
  },

  createList: (title: string): Promise<WatchListType | undefined> => {
    return usecase.createList(title);
  },

  renameList: (listId: string, title: string): Promise<WatchListType | undefined> => {
    return usecase.renameList(listId, title);
  },

  setListVisibility: (listId: string, isPublic: boolean): Promise<WatchListType | undefined> => {
    return usecase.setListVisibility(listId, isPublic);
  },

  deleteList: (listId: string): Promise<void> => {
    return usecase.deleteList(listId);
  },

  loadListItems: (listId: string): Promise<(WatchListType & { items: WatchListItemType[] }) | undefined> => {
    return usecase.loadListItems(listId);
  },

  addAnime: (listId: string, anime: AnimeType): Promise<WatchListItemType | undefined> => {
    return usecase.addAnime(listId, anime);
  },

  removeAnime: (listId: string, animeId: string): Promise<void> => {
    return usecase.removeAnime(listId, animeId);
  },

  clear: () => {
    usecase.clear();
  }
});

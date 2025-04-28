import { useStorage } from "@/shared/useStorage";
import { AnimeListDrivenReadPort } from "../domain";
import { AnimeType } from "../domain";


class AnimeListDrivenReadAdapter implements AnimeListDrivenReadPort {

  private storage = useStorage<AnimeType>(`animelist`, []);

  findById = async (uid: string): Promise<AnimeType | undefined> => {
    try {
      const response = await fetch(`/api/animelist/${uid}`, { method: "GET" });
      // console.log('AnimeListAdapter findById', response);
      if (!response.ok) {
        throw new Error(`Error fetching anime with uid ${uid}: ${response.statusText}`);
      }
      const anime: AnimeType = await response.json();
      anime.publishedAt = new Date(anime.publishedAt)
      anime.releaseAt = new Date(anime.releaseAt)
      anime.updatedAt = new Date(anime.updatedAt)
      // console.log('AnimeListAdapter findById', anime);
      return anime;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return undefined;
    }
  }

  findAll = async (): Promise<AnimeType[]> => {
    try {
      const response = await fetch(`/api/animelist`, { method: "GET" });
      // console.log('AnimeListAdapter findAll', response);
      if (!response.ok) {
        throw new Error(`Error fetching anime list: ${response.statusText}`);
      }
      const result: AnimeType[] = await response.json();
      // console.log('AnimeListAdapter findAll:', result);
      return result.map(a => {
        a.publishedAt = new Date(a.publishedAt)
        a.releaseAt = new Date(a.releaseAt)
        a.updatedAt = new Date(a.updatedAt)
        return a
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  }

  items = () => {
    return this.storage.items || []
  }

}

export const animeListDrivenReadAdapter = () => new AnimeListDrivenReadAdapter();

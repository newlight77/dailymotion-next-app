import { AnimeListPort } from "@/bounded-contexts/video-search-context/domain/usecases/animelist-usecase";
import { AnimeType } from "../domain/model/anime";


class AnimeListAdapter implements AnimeListPort {

  upsert = async (anime: AnimeType): Promise<AnimeType | undefined> => {
    try {
      const response = await fetch(`/api/animelist/${anime.uid}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(anime)
      });

      if (response.status > 400) {
        throw new Error(`an error occurred when sending ${anime} to the api: code=${response.status} message=${response.body}`)
      }

      const result: AnimeType = await response.json()
      return result
      // console.log('after adapter upsert', this.db)
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    return undefined
  }

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
}

const adapter = new AnimeListAdapter();
export default adapter;

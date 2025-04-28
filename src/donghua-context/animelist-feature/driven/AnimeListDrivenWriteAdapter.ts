import { useStorage } from "@/shared/useStorage";
import { AnimeListDrivenWritePort } from "../domain";
import { AnimeType } from "../domain";


class AnimeListDrivenWriteAdapter implements AnimeListDrivenWritePort {

  private storage = useStorage<AnimeType>(`animelist`, []);

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

  addOrUpdate = (anime: AnimeType) => {
    this.storage.addOrUpdate(anime)
  }

  load = (fav: AnimeType[]) => {
    this.storage.loadData(fav)
  }

  reset = () => {
    this.storage.clear()
  }

}

export const animeListDrivenWriteAdapter = () => new AnimeListDrivenWriteAdapter();

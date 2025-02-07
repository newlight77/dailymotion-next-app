import { AnimeListPort } from "@/bounded-contexts/video-search-context/domain/usecases/animelist-usecase";
import { AnimeType } from "../domain/model/anime";
import animelist from '@/data/animelist';


const ANIMELIST: AnimeType[] = [
  ...animelist,
]
.sort((a: AnimeType, b: AnimeType) => b.releaseAt.getUTCMilliseconds() - a.releaseAt.getUTCMilliseconds());

const mapAnimeListToDictionary = (animeList: AnimeType[]): { [key: string]: AnimeType } => {
  return animeList.reduce((acc, anime) => {
    acc[anime.uid] = anime;
    return acc;
  }, {} as { [key: string]: AnimeType });
};

class AnimeListAdapter implements AnimeListPort {

  private readonly db: { [key: string]: AnimeType } = mapAnimeListToDictionary(ANIMELIST)

  upsert = async (anime: AnimeType): Promise<void> => {
    try {
      // console.log('before adapter upsert', anime)
      const found = this.db[anime.uid]
      if (found) {
        const updated = {...found, ...anime}
        this.db[anime.uid] = updated
      } else {
        this.db[anime.uid] = anime
      }
      // console.log('after adapter upsert', this.db)
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  findById = async (uid: string): Promise<AnimeType | undefined> => {
    try {
      const response = await fetch(`/api/anime/${uid}`, { method: "GET" });
      // console.log('AnimeListAdapter findById', response);
      if (!response.ok) {
        throw new Error(`Error fetching anime with uid ${uid}: ${response.statusText}`);
      }
      const anime: AnimeType = await response.json();
      anime.publishedAt = new Date(anime.publishedAt)
      anime.releaseAt = new Date(anime.releaseAt)
      anime.updateAt = new Date(anime.updateAt)
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
        a.updateAt = new Date(a.updateAt)
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

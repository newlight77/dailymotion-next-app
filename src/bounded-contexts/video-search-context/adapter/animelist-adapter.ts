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
      console.log('AnimeListAdapter findById:', uid);
      return this.db[uid]
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  findAll = async (): Promise<AnimeType[]> => {
    try {
      return Object.values(this.db)
    } catch (error) {
        console.error("Error fetching data: ", error);
        return []
    }
  }
}

const adapter = new AnimeListAdapter();
export default adapter;

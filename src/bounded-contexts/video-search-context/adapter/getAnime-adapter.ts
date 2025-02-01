import { AnimeListPort } from "@/bounded-contexts/video-search-context/domain/usecases/animelist-usecase";
import { AnimeType } from "../domain/model/anime";
import animelist from '@/data/animelist';


const ANIMELIST: AnimeType[] = [
  ...animelist,
]
.sort((a: AnimeType, b: AnimeType) => b.releaseAt.getUTCMilliseconds() - a.releaseAt.getUTCMilliseconds());


class AnimeListAdapter implements AnimeListPort {
  findById = async (uid: string): Promise<AnimeType | undefined> => {
    try {
      return ANIMELIST.find(f => f.uid === uid)
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  findAll = async (): Promise<AnimeType[]> => {
    try {
      return ANIMELIST
    } catch (error) {
        console.error("Error fetching data: ", error);
        return []
    }
  }
}

const adapter = new AnimeListAdapter();
export default adapter;

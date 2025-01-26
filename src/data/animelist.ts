import { AnimeType } from "@/search-context/search-provider/domain/anime";

const ANIME_LIST: AnimeType[] = [
  { uid: crypto.randomUUID().toString(),
    type: 'series',
    status: 'completed',
    summary: '',
    thumbnail: '',
    title: 'Battle through the Heaven',
    originalTitle: '斗破苍穹年番',
    subtitle: '',
    publishedBy: '',
    publishedAt: new Date(),
    updateAt: new Date(),
    lastEpisode: 1,
    totalEpisodes: 0
  },
]

export default ANIME_LIST;

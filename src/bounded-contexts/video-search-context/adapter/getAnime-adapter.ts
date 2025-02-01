import { AnimeType } from "../domain/model/anime";

export type AnimeResponse = {
  payload: AnimeType,
  error?: {
    message: string
  }
}

export const getAnime = async(id: string): Promise<AnimeType | undefined> => {

    try {
      const anime: AnimeType = {
          uid: id,
          type: 'series',
          status: 'ongoing',
          thumbnail: 'https://cdn.myanimelist.net/images/anime/1643/102418.jpg',
          title: 'Battle through the Heavens',
          summary: 'Xiao Yan had been waiting for three years before finally meeting Xun\'er at Canaan Academy. After their meeting, he made new friends and established the Panmen group. However, his ultimate goal was to avenge his father and improve his strength so that he could join forces with the Mikami Yunlan Sect. To achieve this, he committed a personal crime and went deep into the Sky Burning Qi Refining Tower to devour the fallen heart flames. After defeating the Yunlan Sect, Xiao Yan\'s mentor, Yao Lao, was taken by the Soul Palace. In their pursuit of Xiao Yan, the Soul Palace enlisted the help of the Little Fairy Doctor and ordered the Poison Sect to attack the Yan Alliance. Despite successfully defending his alliance, Xiao Yan was afflicted with demonic poison spots. To cure himself and rescue Yao Lao, Xiao Yan, along with the Little Medical Fairy and Zi Yan, journeyed to Zhongzhou. Little did they know the dangers that awaited them there.',
          studio: 'Foch Films',
          originalTitle: '斗破苍穹年番',
          subtitle: '',
          publishedAt: new Date('2017-01-01'),
          publishedBy: '',
          releaseAt: new Date('20123-01-12'),
          updateAt: new Date('2025-01-26'),
          lastEpisode: 131,
          totalEpisodes: 0,
      }
      return anime
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

export const getAllAnime = async(): Promise<AnimeType[]> => {

  try {
    const animes: AnimeType[] = [
      {
        uid: crypto.randomUUID().toString(),
        type: 'series',
        status: 'ongoing',
        thumbnail: 'https://cdn.myanimelist.net/images/anime/1643/102418.jpg',
        title: 'Battle through the Heavens',
        summary: 'Xiao Yan had been waiting for three years before finally meeting Xun\'er at Canaan Academy. After their meeting, he made new friends and established the Panmen group. However, his ultimate goal was to avenge his father and improve his strength so that he could join forces with the Mikami Yunlan Sect. To achieve this, he committed a personal crime and went deep into the Sky Burning Qi Refining Tower to devour the fallen heart flames. After defeating the Yunlan Sect, Xiao Yan\'s mentor, Yao Lao, was taken by the Soul Palace. In their pursuit of Xiao Yan, the Soul Palace enlisted the help of the Little Fairy Doctor and ordered the Poison Sect to attack the Yan Alliance. Despite successfully defending his alliance, Xiao Yan was afflicted with demonic poison spots. To cure himself and rescue Yao Lao, Xiao Yan, along with the Little Medical Fairy and Zi Yan, journeyed to Zhongzhou. Little did they know the dangers that awaited them there.',
        studio: 'Foch Films',
        originalTitle: '斗破苍穹年番',
        subtitle: '',
        publishedAt: new Date('2017-01-01'),
        publishedBy: '',
        releaseAt: new Date('20123-01-12'),
        updateAt: new Date('2025-01-26'),
        lastEpisode: 131,
        totalEpisodes: 0,
      },
    ]
    return animes
  } catch (error) {
      console.error("Error fetching data: ", error);
      return []
  }
}
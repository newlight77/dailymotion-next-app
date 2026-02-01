import { PrismaClient } from '@prisma/client'
import animelist from './animelist.json';
import { AnimeType } from '@/donghua-context/animelist-feature';


const prisma = new PrismaClient();

const load = async () => {
  try {
    // delete dependent WatchListItem rows first to avoid foreign key constraint
    await prisma.watchListItem.deleteMany();
    await prisma.anime.deleteMany();
    console.log('insert records in anime table');
    await prisma.anime.createMany({
      data: animelist.map(item => ({
        uid: item.uid ? item.uid : crypto.randomUUID().toString(),
        title: item.title,
        updateDays: item.updateDays ?? '',
        type: item.type === 'movie' ? 'movie' : 'series',
        status: item.status === 'completed' ? 'completed' : 'ongoing',
        summary: item.summary ?? '',
        thumbnail: item.thumbnail ?? '',
        thumbnailFilename: item.thumbnailFilename ?? '',
        studio: item.studio ?? '',
        releaseAt: new Date(item.releaseAt),
        updatedAt: new Date(),
        publishedAt: new Date(item.publishedAt),
        publishedBy: item.publishedBy ?? '',
        subtitle: item.subtitle ?? '',
        originalTitle: item.originalTitle ?? '',
        firstSeasonEpisode: item.firstSeasonEpisode ?? 0,
        lastSeasonEpisode: item.lastSeasonEpisode ?? 0,
        totalSeasonEpisodes: item.totalSeasonEpisodes ?? 0,
        lastEpisode: item.lastEpisode ?? 0,
        totalEpisodes: item.totalEpisodes ?? 0,
      })) as AnimeType[]
    });
    console.log('populate data completed');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
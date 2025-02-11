import { PrismaClient } from '@prisma/client'
import animelist from './animelist';
import { AnimeType } from '@/bounded-contexts/animelist-context';


const prisma = new PrismaClient();
const ANIMELIST: AnimeType[] = [
  ...animelist,
]
.sort((a: AnimeType, b: AnimeType) => b.releaseAt.getUTCMilliseconds() - a.releaseAt.getUTCMilliseconds());


const load = async () => {
  try {
    await prisma.anime.deleteMany();
    console.log('insert records in anime table');
    await prisma.anime.createMany({
      data: ANIMELIST.map(anime => ({
        ...anime,
        updateDays: anime.updateDays,
        // publishedAt: new Date(anime.publishedAt),
        // releaseAt: new Date(anime.releaseAt),
        updatedAt: new Date(),
      }))
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
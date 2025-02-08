import { PrismaClient } from '@prisma/client'
import animelist from './animelist';
import { AnimeType } from '@/bounded-contexts/videosearch-context/domain/model/anime';


const prisma = new PrismaClient();
const ANIMELIST: AnimeType[] = [
  ...animelist,
]
.sort((a: AnimeType, b: AnimeType) => b.releaseAt.getUTCMilliseconds() - a.releaseAt.getUTCMilliseconds());


const load = async () => {
  try {
    await prisma.anime.deleteMany();
    console.log('Deleted records in product table');
    await prisma.anime.createMany({
      data: ANIMELIST.map(anime => ({ ...anime, updatedAt: new Date() }))
    });
    console.log('Added category data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
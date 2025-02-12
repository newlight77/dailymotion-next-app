import { PrismaClient } from '@prisma/client'
import animelist from './animelist.json';
import { AnimeType } from '@/bounded-contexts/animelist-context';


const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.anime.deleteMany();
    console.log('insert records in anime table');
    await prisma.anime.createMany({
      data: animelist.map(item => ({
        ...item,
        uid: item.uid ? item.uid : crypto.randomUUID().toString(),
        type: item.type === 'movie' ? 'movie' : 'series',
        status: item.status === 'completed' ? 'completed' : 'ongoing',
        publishedAt: new Date(item.publishedAt),
        releaseAt: new Date(item.releaseAt),
        updatedAt: new Date(),
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
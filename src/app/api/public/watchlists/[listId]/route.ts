import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getRatingsMap } from '@/core/core-lib/server/ratingAggregateCache';

const prisma = new PrismaClient();

type ParamType = {
  params: Promise<{ listId: string }>
}

export async function GET(_: NextRequest, { params }: ParamType) {
  const { listId } = await params;

  const list = await prisma.watchList.findFirst({
    where: { uid: listId, isPublic: true },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: { anime: true },
      },
    },
  });

  if (!list) {
    return new NextResponse(JSON.stringify({ error: 'Public watch list not found' }), { status: 404 });
  }

  // attach ratings for every anime in the list (single DB query)
  const animeIds = list.items.filter(i => i.anime).map(i => i.anime!.uid);
  if (animeIds.length > 0) {
    const ratingsMap = await getRatingsMap(prisma, animeIds);

    list.items.forEach(item => {
      if (item.anime) {
        item.anime = { ...item.anime, rating: ratingsMap[item.anime.uid] || { average: 0, count: 0 } } as typeof item.anime & { rating?: { average: number; count: number } };
      }
    });
  }

  return new NextResponse(JSON.stringify(list), { status: 200 });
}

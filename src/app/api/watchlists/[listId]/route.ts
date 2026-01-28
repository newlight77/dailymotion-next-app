import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUserId } from '@/core/capabilities/auth-feature/server/getAuthUser';
import { getRatingsMap } from '@/core/core-lib/server/ratingAggregateCache';

const prisma = new PrismaClient();

type ParamType = {
  params: Promise<{ listId: string }>
}

export async function GET(_: NextRequest, { params }: ParamType) {
  const { listId } = await params;
  const userId = await getAuthUserId();

  const list = await prisma.watchList.findFirst({
    where: {
      uid: listId,
      OR: [
        { ownerId: userId ?? undefined },
        { isPublic: true },
      ],
    },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: { anime: true },
      },
    },
  });

  if (list && list.items && list.items.length > 0) {
    const animeIds = list.items.filter(i => i.anime).map(i => i.anime!.uid);
    if (animeIds.length > 0) {
      const ratingsMap = await getRatingsMap(prisma, animeIds);

      list.items.forEach(item => {
        if (item.anime) {
          item.anime = { ...item.anime, rating: ratingsMap[item.anime.uid] || { average: 0, count: 0 } } as typeof item.anime & { rating?: { average: number; count: number } };
        }
      });
    }
  }

  if (!list) {
    return new NextResponse(JSON.stringify({ error: 'Watch list not found' }), { status: 404 });
  }

  return new NextResponse(JSON.stringify(list), { status: 200 });
}

export async function POST(request: NextRequest, { params }: ParamType) {
  const { listId } = await params;
  const body = await request.json();
  const { animeId } = body ?? {};
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!animeId) {
    return new NextResponse(JSON.stringify({ error: 'animeId is required' }), { status: 400 });
  }

  const ownedList = await prisma.watchList.findFirst({
    where: { uid: listId, ownerId: userId },
  });

  if (!ownedList) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const item = await prisma.watchListItem.upsert({
    where: {
      listId_animeId: {
        listId: listId,
        animeId,
      },
    },
    create: {
      listId: listId,
      animeId,
    },
    update: {},
    include: { anime: true },
  });

  await prisma.watchList.update({
    where: { uid: listId },
    data: { updatedAt: new Date() },
  });

  return new NextResponse(JSON.stringify(item), { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: ParamType) {
  const { listId } = await params;
  const body = await request.json();
  const { title, isPublic } = body ?? {};
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!title && typeof isPublic !== 'boolean') {
    return new NextResponse(JSON.stringify({ error: 'title or isPublic is required' }), { status: 400 });
  }

  const ownedList = await prisma.watchList.findFirst({
    where: { uid: listId, ownerId: userId },
  });

  if (!ownedList) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const list = await prisma.watchList.update({
    where: { uid: listId },
    data: {
      ...(title ? { title } : {}),
      ...(typeof isPublic === 'boolean' ? { isPublic } : {}),
      updatedAt: new Date(),
    },
  });

  return new NextResponse(JSON.stringify(list), { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: ParamType) {
  const { listId } = await params;
  const animeId = request.nextUrl.searchParams.get('animeId');
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const ownedList = await prisma.watchList.findFirst({
    where: { uid: listId, ownerId: userId },
  });

  if (!ownedList) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  if (animeId) {
    await prisma.watchListItem.deleteMany({
      where: {
        listId: listId,
        animeId,
      },
    });

    await prisma.watchList.update({
      where: { uid: listId },
      data: { updatedAt: new Date() },
    });

    return new NextResponse(null, { status: 204 });
  }

  await prisma.watchList.delete({
    where: { uid: listId },
  });

  return new NextResponse(null, { status: 204 });
}
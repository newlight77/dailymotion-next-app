import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ParamType = {
  params: Promise<{ collectionId: string; listId: string }>
}

export async function GET(_: NextRequest, { params }: ParamType) {
  const { collectionId, listId } = await params;
  const list = await prisma.watchList.findFirst({
    where: {
      uid: listId,
      collectionId: collectionId,
    },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: { anime: true },
      },
    },
  });

  if (!list) {
    return new NextResponse(JSON.stringify({ error: 'Watch list not found' }), { status: 404 });
  }

  return new NextResponse(JSON.stringify(list), { status: 200 });
}

export async function POST(request: NextRequest, { params }: ParamType) {
  const { listId } = await params;
  const body = await request.json();
  const { animeId } = body ?? {};

  if (!animeId) {
    return new NextResponse(JSON.stringify({ error: 'animeId is required' }), { status: 400 });
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
  const { title } = body ?? {};

  if (!title) {
    return new NextResponse(JSON.stringify({ error: 'title is required' }), { status: 400 });
  }

  const list = await prisma.watchList.update({
    where: { uid: listId },
    data: { title, updatedAt: new Date() },
  });

  return new NextResponse(JSON.stringify(list), { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: ParamType) {
  const { listId } = await params;
  const animeId = request.nextUrl.searchParams.get('animeId');

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

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

  return new NextResponse(JSON.stringify(list), { status: 200 });
}

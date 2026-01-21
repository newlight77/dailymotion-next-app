import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ParamType = {
  params: Promise<{ collectionId: string }>
}

export async function GET(_: NextRequest, { params }: ParamType) {
  const { collectionId } = await params;
  const collection = await prisma.watchListCollection.findUnique({
    where: { uid: collectionId },
    include: {
      lists: {
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  if (!collection) {
    return new NextResponse(JSON.stringify({ error: 'Watch list collection not found' }), { status: 404 });
  }

  return new NextResponse(JSON.stringify(collection), { status: 200 });
}

export async function POST(request: NextRequest, { params }: ParamType) {
  const { collectionId } = await params;
  const body = await request.json();
  const { title } = body ?? {};

  if (!title) {
    return new NextResponse(JSON.stringify({ error: 'title is required' }), { status: 400 });
  }

  const list = await prisma.watchList.create({
    data: {
      collectionId: collectionId,
      title,
    },
  });

  return new NextResponse(JSON.stringify(list), { status: 201 });
}

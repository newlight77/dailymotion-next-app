import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUserId } from '@/core/capabilities/auth-feature/server/getAuthUser';

const prisma = new PrismaClient();

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const items = await prisma.followedAnime.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  return new NextResponse(JSON.stringify(items), { status: 200 });
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const { animeId, title, subtitle, originalTitle, lastEpisode } = body ?? {};

  if (!animeId || !title) {
    return new NextResponse(JSON.stringify({ error: 'animeId and title are required' }), { status: 400 });
  }

  const item = await prisma.followedAnime.upsert({
    where: { userId_animeId: { userId, animeId } },
    create: {
      userId,
      animeId,
      title,
      subtitle,
      originalTitle,
      lastEpisode,
    },
    update: {
      title,
      subtitle,
      originalTitle,
      lastEpisode,
      updatedAt: new Date(),
    },
  });

  return new NextResponse(JSON.stringify(item), { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const animeId = request.nextUrl.searchParams.get('animeId');
  if (!animeId) {
    return new NextResponse(JSON.stringify({ error: 'animeId is required' }), { status: 400 });
  }

  await prisma.followedAnime.deleteMany({
    where: { userId, animeId },
  });

  return new NextResponse(null, { status: 204 });
}

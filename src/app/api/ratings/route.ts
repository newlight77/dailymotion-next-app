import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUserId } from '@/core/capabilities/auth-feature/server/getAuthUser';

const prisma = new PrismaClient();

const clampRating = (value: number): number => Math.max(1, Math.min(5, value));

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const animeId = searchParams.get('animeId');
    if (!animeId) {
      return new NextResponse(JSON.stringify({ error: 'animeId is required' }), { status: 400 });
    }

    const [aggregate, userId] = await Promise.all([
      prisma.rating.aggregate({
        where: { animeId },
        _avg: { value: true },
        _count: { value: true },
      }),
      getAuthUserId(),
    ]);

    const userRating = userId
      ? await prisma.rating.findUnique({
          where: { animeId_ownerId: { animeId, ownerId: userId } },
        })
      : null;

    return new NextResponse(
      JSON.stringify({
        animeId,
        average: aggregate._avg.value ?? 0,
        count: aggregate._count.value ?? 0,
        userRating: userRating ? { uid: userRating.uid, value: userRating.value } : null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to load rating stats', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to load ratings' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const animeId = body?.animeId?.toString() || '';
    const value = Number(body?.value);

    if (!animeId || Number.isNaN(value)) {
      return new NextResponse(JSON.stringify({ error: 'animeId and value are required' }), { status: 400 });
    }

    const rating = await prisma.rating.upsert({
      where: { animeId_ownerId: { animeId, ownerId: userId } },
      create: {
        animeId,
        ownerId: userId,
        value: clampRating(value),
      },
      update: {
        value: clampRating(value),
        updatedAt: new Date(),
      },
    });

    const comment = await prisma.comment.findUnique({
      where: { animeId_ownerId: { animeId, ownerId: userId } },
    });

    if (comment) {
      await prisma.review.upsert({
        where: { animeId_ownerId: { animeId, ownerId: userId } },
        create: {
          animeId,
          ownerId: userId,
          ratingId: rating.uid,
          commentId: comment.uid,
        },
        update: {
          ratingId: rating.uid,
          commentId: comment.uid,
          updatedAt: new Date(),
        },
      });
    }

    return new NextResponse(JSON.stringify(rating), { status: 200 });
  } catch (error) {
    console.error('Failed to save rating', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to save rating' }), { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUserId } from '@/core/capabilities/auth-feature/server/getAuthUser';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const animeId = searchParams.get('animeId');
    if (!animeId) {
      return new NextResponse(JSON.stringify({ error: 'animeId is required' }), { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { animeId },
      orderBy: { updatedAt: 'desc' },
      include: {
        owner: { select: { uid: true, name: true, username: true } },
      },
    });

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    console.error('Failed to load comments', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to load comments' }), { status: 500 });
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
    const content = body?.content?.toString() || '';

    if (!animeId || !content.trim()) {
      return new NextResponse(JSON.stringify({ error: 'animeId and content are required' }), { status: 400 });
    }

    const comment = await prisma.comment.upsert({
      where: { animeId_ownerId: { animeId, ownerId: userId } },
      create: {
        animeId,
        ownerId: userId,
        content: content.trim(),
      },
      update: {
        content: content.trim(),
        updatedAt: new Date(),
      },
    });



    return new NextResponse(JSON.stringify(comment), { status: 200 });
  } catch (error) {
    console.error('Failed to save comment', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to save comment' }), { status: 500 });
  }
}

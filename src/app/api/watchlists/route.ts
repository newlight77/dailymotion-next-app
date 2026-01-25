import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUserId } from '@/core/capabilities/auth-feature/server/getAuthUser';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const lists = await prisma.watchList.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: 'desc' },
    });

    return new NextResponse(JSON.stringify(lists), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch watch lists', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch watch lists' }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { title } = body ?? {};
    if (!title) {
      return new NextResponse(JSON.stringify({ error: 'title is required' }), { status: 400 });
    }

    const list = await prisma.watchList.create({
      data: { title, ownerId: userId },
    });

    return new NextResponse(JSON.stringify(list), { status: 201 });
  } catch (error) {
    console.error('Failed to create watch list', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create watch list' }),
      { status: 500 }
    );
  }
}

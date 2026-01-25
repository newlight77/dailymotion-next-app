import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUserId } from '@/core/capabilities/auth-feature/server/getAuthUser';

const prisma = new PrismaClient();

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const items = await prisma.followedVideoOwner.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  });

  return new NextResponse(JSON.stringify(items), { status: 200 });
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const { owner, order } = body ?? {};

  if (!owner) {
    return new NextResponse(JSON.stringify({ error: 'owner is required' }), { status: 400 });
  }

  const item = await prisma.followedVideoOwner.upsert({
    where: { userId_owner: { userId, owner } },
    create: {
      userId,
      owner,
      order: typeof order === 'number' ? order : 0,
    },
    update: {
      order: typeof order === 'number' ? order : 0,
    },
  });

  return new NextResponse(JSON.stringify(item), { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const owner = request.nextUrl.searchParams.get('owner');
  if (!owner) {
    return new NextResponse(JSON.stringify({ error: 'owner is required' }), { status: 400 });
  }

  await prisma.followedVideoOwner.deleteMany({
    where: { userId, owner },
  });

  return new NextResponse(null, { status: 204 });
}

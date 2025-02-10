import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnimeType } from '@/bounded-contexts/animelist-context';

const prisma = new PrismaClient();


export async function GET() {

  const animelist = await prisma.anime.findMany({
    take: 200,
  });

  return new NextResponse(JSON.stringify(animelist), {
    status: 200,
  });
}

/** create many from a list */
export async function POST(request: NextRequest) {

  const animelist: AnimeType[] = await request.json()

  if (animelist) {
    await prisma.anime.createMany({
      data: animelist
    });
  }

  return new NextResponse(JSON.stringify(animelist), {
    status: 200,
  });
}

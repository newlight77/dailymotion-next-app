import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET() {

  const animelist = await prisma.anime.findMany({
    take: 100,
  });

  return new NextResponse(JSON.stringify(animelist), {
    status: 200,
  });
}

/** create many from a list */
export async function POST(request: NextRequest) {

  const animelist = await request.json()

  if (animelist) {
    await prisma.anime.createMany({
      data: animelist
    });
  }

  return new NextResponse(JSON.stringify(animelist), {
    status: 200,
  });
}

type ParamType = {
  params: Promise<{ uid: string }>
}

export async function PUT(request: NextRequest, { params }: ParamType) {
  const uid = (await params).uid
  const anime = await request.json()

  const found = await prisma.anime.findFirst({
    where: {
      uid: uid
    }
  })

  if (found) {
    const updated = await prisma.anime.update({
      where: { uid: uid },
      data: anime
    })

    return new NextResponse(JSON.stringify(updated), {
      status: 200,
    });
  }

  const created = await prisma.anime.create({
    data: anime
  })

  return new NextResponse(JSON.stringify(created), {
    status: 201,
  });
}
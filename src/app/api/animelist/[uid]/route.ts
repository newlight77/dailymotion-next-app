import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnimeType } from '@/bounded-contexts/videosearch-context/domain/model/anime';

const prisma = new PrismaClient();

type ParamType = {
  params: Promise<{ uid: string }>
}

export async function GET(request: NextRequest, { params }: ParamType) {
  // console.log('Anime with UID', (await params).uid);

  const uid = (await params).uid

  const anime = await prisma.anime.findFirst({
    where: {
      uid: uid
    }
  })
  // const anime = ANIMELIST.find(anime => anime.uid === uid);
  console.log(`found by uid`, uid, anime);

  if (!anime) {
    // console.log(`Anime with UID ${uid} not found`);
    return new NextResponse(JSON.stringify({ name: `Anime with uid ${uid} not found` }), {
      status: 404
    });
  }

  return new NextResponse(JSON.stringify(anime), {
    status: 200,
  });
}

export async function PUT(request: NextRequest, { params }: ParamType) {
  const uid = (await params).uid
  const anime: AnimeType = await request.json()

  const playload = {
    ...anime,
    lastEpisode: Number(anime.lastEpisode),
    totalEpisodes: anime.totalEpisodes? Number(anime.totalEpisodes) : 0,
    publishedAt: new Date(anime.publishedAt),
    releaseAt: new Date(anime.releaseAt),
    updatedAt: new Date()
  }
  console.log(`playload uid`, uid, playload);

  const found = await prisma.anime.findFirst({
    where: { uid: uid }
  })

  console.log(`found by uid`, uid, found);
  if (found) {
    const updated = await prisma.anime.update({
      where: { uid: uid },
      data: playload
    })

    console.log(`updated uid`, uid, updated);
    return new NextResponse(JSON.stringify(updated), {
      status: 200,
    });
  }

  const created = await prisma.anime.create({
    data: playload
  })

  console.log(`created uid`, uid, created);
  return new NextResponse(JSON.stringify(created), {
    status: 201,
  });
}
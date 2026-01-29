import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnimeType } from '@/donghua-context/animelist-feature';
import { isAdminUser } from '@/core/capabilities/auth-feature/server/isAdmin';
import { getRatingForAnime } from '@/core/core-lib/server/ratingAggregateCache';

const prisma = new PrismaClient();

type ParamType = {
  params: Promise<{ uid: string }>
}

export async function GET(request: NextRequest, { params }: ParamType) {
  // console.log('Anime with UID', (await params).uid);

  const uid = (await params).uid

  const anime = await prisma.anime.findFirst({ where: { uid } });

  if (!anime) {
    return new NextResponse(JSON.stringify({ name: `Anime with uid ${uid} not found` }), { status: 404 });
  }

  // attach aggregated rating for this anime (cached)
  const rating = await getRatingForAnime(prisma, uid);
  const animeWithRating = { ...anime, rating };

  return new NextResponse(JSON.stringify(animeWithRating), {
    status: 200,
  });
}

export async function PUT(request: NextRequest, { params }: ParamType) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }
  const uid = (await params).uid;
  // parse incoming body as a partial AnimeType with an optional runtime-only `rating` field
  const animeBody = await request.json() as Partial<AnimeType> & { rating?: unknown };

  // create a shallow copy and remove any runtime-only fields before persisting
  const animeSafe: Partial<AnimeType> = { ...animeBody };
  if (Object.prototype.hasOwnProperty.call(animeSafe, 'rating')) {
    // use Record<string, unknown> cast to safely delete without using `any`
    delete (animeSafe as Record<string, unknown>).rating;
  }

  const parseDate = (v?: unknown): Date => {
    if (!v) return new Date();
    if (typeof v === 'string') return new Date(v);
    if (v instanceof Date) return v;
    if (typeof v === 'number') return new Date(v);
    return new Date(String(v));
  };

  const payload = {
    ...animeSafe,
    firstSeasonEpisode: animeSafe.firstSeasonEpisode ? Number(animeSafe.firstSeasonEpisode) : 0,
    lastSeasonEpisode: animeSafe.lastSeasonEpisode ? Number(animeSafe.lastSeasonEpisode) : 0,
    totalSeasonEpisodes: animeSafe.totalSeasonEpisodes ? Number(animeSafe.totalSeasonEpisodes) : 0,
    lastEpisode: animeSafe.lastEpisode ? Number(animeSafe.lastEpisode) : 0,
    totalEpisodes: animeSafe.totalEpisodes ? Number(animeSafe.totalEpisodes) : 0,
    publishedAt: parseDate((animeSafe as Record<string, unknown>)['publishedAt']),
    releaseAt: parseDate((animeSafe as Record<string, unknown>)['releaseAt']),
    updatedAt: new Date()
  };
  console.log(`payload uid`, uid, payload);

  const found = await prisma.anime.findFirst({
    where: { uid: uid }
  })

  console.log(`found by uid`, uid, found);
  if (found) {
    try {
      const updated = await prisma.anime.update({
        where: { uid: uid },
        data: payload
      })
      console.log(`updated uid`, uid, updated);
      return new NextResponse(JSON.stringify(updated), { status: 200 });
    } catch (error) {
      console.error('Failed to update anime', error);
      return new NextResponse(JSON.stringify({ error: String(error) }), { status: 500 });
    }
  }

  try {
    // ensure required fields are present for create
    const required = ['title', 'updateDays', 'type', 'status', 'summary', 'thumbnail', 'thumbnailFilename', 'studio', 'releaseAt', 'publishedAt'];
    const missing = required.filter((k) => !(payload as Record<string, unknown>)[k]);
    if (missing.length > 0) {
      return new NextResponse(JSON.stringify({ error: `Missing required fields for create: ${missing.join(', ')}` }), { status: 400 });
    }

    // construct a properly-typed create object (including uid from path)
    const createData = {
      uid,
      title: String(payload.title),
      updateDays: String(payload.updateDays),
      type: String(payload.type),
      status: String(payload.status),
      summary: String(payload.summary),
      thumbnail: String(payload.thumbnail),
      thumbnailFilename: String(payload.thumbnailFilename || ''),
      studio: String(payload.studio),
      releaseAt: payload.releaseAt as Date,
      publishedAt: payload.publishedAt as Date,
      updatedAt: payload.updatedAt as Date,
      subtitle: payload.subtitle ? String(payload.subtitle) : undefined,
      originalTitle: payload.originalTitle ? String(payload.originalTitle) : undefined,
      firstSeasonEpisode: payload.firstSeasonEpisode ? Number(payload.firstSeasonEpisode) : undefined,
      lastSeasonEpisode: payload.lastSeasonEpisode ? Number(payload.lastSeasonEpisode) : undefined,
      totalSeasonEpisodes: payload.totalSeasonEpisodes ? Number(payload.totalSeasonEpisodes) : undefined,
      lastEpisode: payload.lastEpisode ? Number(payload.lastEpisode) : undefined,
      totalEpisodes: payload.totalEpisodes ? Number(payload.totalEpisodes) : undefined,
    };

    const created = await prisma.anime.create({ data: createData })
    console.log(`created uid`, uid, created);
    return new NextResponse(JSON.stringify(created), { status: 201 });
  } catch (error) {
    console.error('Failed to create anime', error);
    return new NextResponse(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
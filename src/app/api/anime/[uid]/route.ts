import { AnimeType } from '@/bounded-contexts/video-search-context/domain/model/anime';
import animelist from '@/data/animelist';
import { NextRequest, NextResponse } from 'next/server';

const ANIMELIST: AnimeType[] = [
  ...animelist,
]
.sort((a: AnimeType, b: AnimeType) => b.releaseAt.getUTCMilliseconds() - a.releaseAt.getUTCMilliseconds());


type ParamType = {
  params: Promise<{ uid: string }>
}

export async function GET(request: NextRequest, { params }: ParamType) {
  // console.log('Anime with UID', (await params).uid);

  const uid = (await params).uid

  const anime = ANIMELIST.find(anime => anime.uid === uid);
  // console.log(`found`, anime);

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

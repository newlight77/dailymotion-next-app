import { AnimeType } from '@/bounded-contexts/video-search-context/domain/model/anime';
import animelist from '@/data/animelist';
import { NextRequest, NextResponse } from 'next/server';


const ANIMELIST: AnimeType[] = [
  ...animelist,
]
.sort((a: AnimeType, b: AnimeType) => b.releaseAt.getUTCMilliseconds() - a.releaseAt.getUTCMilliseconds());


export async function GET(request: NextRequest) {
  return new NextResponse(JSON.stringify(ANIMELIST), {
    status: 200,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AnimeType } from '@/donghua-context/animelist-feature';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { isAdminUser } from '@/core/capabilities/auth-feature/server/isAdmin';
import { getRatingsMap } from '@/core/core-lib/server/ratingAggregateCache';

const prisma = new PrismaClient();


export async function GET() {

  const animelist = await prisma.anime.findMany({
    take: 300,
  })

  const sorted = animelist.sort((a, b) => b.title.localeCompare(a.title))

  // fetch aggregated ratings for all anime in one query (cached)
  const animeIds = sorted.map(a => a.uid);
  const ratingsMap = await getRatingsMap(prisma, animeIds);

  const result = await Promise.all(
    sorted.map(async (a) => {
      console.log(`saving thumbnail filename ${a.thumbnail} ${a.thumbnailFilename}`);

      let thumbnailFilename = a.thumbnailFilename;

      if (a.thumbnail && a.thumbnail !== '' && a.thumbnailFilename === '') {

        const filename = `${a.title.replaceAll(' ', '-')}.jpg`
        const savedFilename = await fetchImageAndSave(a.thumbnail, filename)

        if (savedFilename) {
          console.log(`saved thumbnail file for uid ${a.uid} ${filename}`);
          await prisma.anime.update({
            where: { uid: a.uid },
            data: {
              ...a,
              thumbnailFilename: filename
            }
          })

          thumbnailFilename = savedFilename
        }
      }

      return {
        ...a,
        thumbnailFilename,
        rating: ratingsMap[a.uid] || { average: 0, count: 0 },
      }
    })
  )

  return new NextResponse(JSON.stringify(result), { status: 200 });
}

/** create many from a list */
export async function POST(request: NextRequest) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

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

const fetchImageAndSave = async (url: string, filename: string): Promise<string | undefined> => {

  const res = await fetch(url);
  if (! res.headers.get('content-type')?.includes('image')) {
    console.log(`not an image file for ${filename}`);
    return undefined
  }

  const imageBlob = await res.blob();
  const buffer = Buffer.from((await imageBlob.arrayBuffer()));

  try {
    const dest = path.join(process.cwd(), "public/uploads/")

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const destFile = path.join(process.cwd(), "public/uploads/" + filename)

    if (fs.existsSync(destFile)) {
      console.log(`file ${destFile} exists`);
      return undefined
    }

    await writeFile(destFile, buffer);

    return filename
  } catch (error) {
    console.log("Error occured ", error);
    return undefined
  }
}

// const fetchImage = async (url: string): Promise<string> => {
//   if (url || url !== '') {
//     const res = await fetch(url);
//     const imageBlob = await res.blob();
//     const imageObjectURL = URL.createObjectURL(imageBlob);
//     return imageObjectURL
//   }
//   return ''
// }

// const fetchImage2 = async (url: string): Promise<string> => {
//   if (url || url !== '') {
//     const res = await fetch(url);
//     const imageBlob = await res.blob();
//     const imageBuffer = Buffer.from((await imageBlob.arrayBuffer()));
//     const base64Image = imageBuffer.toString('base64');
//     const image = `data:${res.headers.get('content-type')};base64,${base64Image}`;
//     return image;
//   }
//   return ''
// }

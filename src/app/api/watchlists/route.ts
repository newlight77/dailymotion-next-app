import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const existing = await prisma.watchListCollection.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return new NextResponse(JSON.stringify(existing), { status: 200 });
    }

    const collection = await prisma.watchListCollection.create({
      data: {},
    });

    return new NextResponse(JSON.stringify(collection), { status: 201 });
  } catch (error) {
    console.error('Failed to fetch watch list collection', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch watch list collection' }),
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const collection = await prisma.watchListCollection.create({
      data: {},
    });

    return new NextResponse(JSON.stringify(collection), { status: 201 });
  } catch (error) {
    console.error('Failed to create watch list collection', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create watch list collection' }),
      { status: 500 }
    );
  }
}

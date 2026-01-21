import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

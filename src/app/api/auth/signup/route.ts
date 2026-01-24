import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const isPasswordValid = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?`~]/.test(password)
  );
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const email = body?.email?.toString().trim().toLowerCase() || '';
    const password = body?.password?.toString() || '';
    const firstName = body?.firstName?.toString().trim() || '';
    const lastName = body?.lastName?.toString().trim() || '';

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isPasswordValid(password)) {
      return NextResponse.json({ error: 'Password does not meet requirements' }, { status: 400 });
    }

    const existing = await prisma.authUser.findFirst({
      where: {
        OR: [{ username: email }, { email }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.authUser.create({
      data: {
        username: email,
        email,
        name: `${firstName} ${lastName}`.trim(),
        passwordHash,
      },
    });

    return NextResponse.json({ id: user.uid, email: user.email, name: user.name }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
};

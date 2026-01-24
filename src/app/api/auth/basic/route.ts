import { NextResponse } from 'next/server';
import { verifyBasicCredentials } from '@/core/capabilities/auth-feature/server/basicAuth';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const username = body?.username?.toString() || '';
    const password = body?.password?.toString() || '';

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await verifyBasicCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
};

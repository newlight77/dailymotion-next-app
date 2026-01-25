import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';

export const getAuthUserId = async (): Promise<string | null> => {
  const session = await getServerSession(authOptions);
  const userId = session?.user && (session.user as { id?: string }).id;
  return userId || null;
};

import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';

const parseList = (value?: string | null) =>
  (value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

export const isAdminUser = async (): Promise<boolean> => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  const adminEmails = parseList(process.env.ADMIN_EMAILS);
  const adminUserIds = parseList(process.env.ADMIN_USER_IDS);

  const email = session.user.email || '';
  const id = (session.user as { id?: string }).id || '';

  return Boolean(
    (email && adminEmails.includes(email)) || (id && adminUserIds.includes(id))
  );
};

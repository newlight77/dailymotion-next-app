import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export type BasicAuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export const verifyBasicCredentials = async (username: string, password: string): Promise<BasicAuthUser | null> => {
  const user = await prisma.authUser.findUnique({ where: { username } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return {
    id: user.uid,
    name: user.name ?? user.username,
    email: user.email ?? null,
  };
};

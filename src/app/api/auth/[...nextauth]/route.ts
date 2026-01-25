import NextAuth from 'next-auth';
import { authOptions } from '@/core/capabilities/auth-feature/server/authOptions';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

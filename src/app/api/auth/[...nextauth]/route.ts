import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { verifyBasicCredentials, type BasicAuthUser } from '@/core/capabilities/auth-feature/server/basicAuth';

const providers = [];

providers.push(
  CredentialsProvider({
    id: 'credentials',
    name: 'Basic Auth',
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.username || !credentials?.password) return null;

      const user = await verifyBasicCredentials(credentials.username, credentials.password);
      if (user) return { ...user, access_token: `local:${user.id}` } as BasicAuthUser & { access_token?: string };

      const demoUser = process.env.BASIC_AUTH_DEMO_USER;
      const demoPass = process.env.BASIC_AUTH_DEMO_PASS;
      if (demoUser && demoPass && credentials.username === demoUser && credentials.password === demoPass) {
        return { id: demoUser, name: demoUser, email: demoUser, access_token: `local:${demoUser}` } as BasicAuthUser & { access_token?: string };
      }

      return null;
    },
  })
);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID) {
  providers.push(
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    })
  );
}

if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    })
  );
}

const handler = NextAuth({
  providers,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // include account access token when available (oauth providers)
      if (account && typeof account.access_token === 'string') {
        (token as Record<string, unknown>)['accessToken'] = account.access_token;
      }

      if (user) {
        token.id = (user as BasicAuthUser).id;
        // If credentials authorize returned an access_token, include it
        const userRecord = user as unknown as Record<string, unknown>;
        if (userRecord && typeof userRecord['access_token'] === 'string') {
          (token as Record<string, unknown>)['accessToken'] = userRecord['access_token'] as string;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }

      const tokenRecord = token as Record<string, unknown>;
      if (typeof tokenRecord['accessToken'] === 'string') {
        (session as unknown as Record<string, unknown>)['accessToken'] = tokenRecord['accessToken'] as string;
      }

      return session;
    },
  },
});
export { handler as GET, handler as POST };

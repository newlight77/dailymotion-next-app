import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { verifyBasicCredentials, type BasicAuthUser } from './basicAuth';

const THIRTY_MINUTES = 30 * 60;

const refreshAccessToken = async (token: Record<string, unknown>): Promise<Record<string, unknown>> => {
  const provider = token.provider as string | undefined;
  const refreshToken = token.refreshToken as string | undefined;

  if (!provider || !refreshToken) {
    return { ...token, error: 'RefreshAccessTokenError' };
  }

  try {
    let tokenUrl = '';
    const body = new URLSearchParams();

    if (provider === 'google') {
      tokenUrl = 'https://oauth2.googleapis.com/token';
      body.set('client_id', process.env.GOOGLE_CLIENT_ID || '');
      body.set('client_secret', process.env.GOOGLE_CLIENT_SECRET || '');
    } else if (provider === 'azure-ad') {
      const tenant = process.env.AZURE_AD_TENANT_ID || 'common';
      tokenUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
      body.set('client_id', process.env.AZURE_AD_CLIENT_ID || '');
      body.set('client_secret', process.env.AZURE_AD_CLIENT_SECRET || '');
    } else if (provider === 'apple') {
      tokenUrl = 'https://appleid.apple.com/auth/token';
      body.set('client_id', process.env.APPLE_CLIENT_ID || '');
      body.set('client_secret', process.env.APPLE_CLIENT_SECRET || '');
    } else {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const refreshed = await response.json() as Record<string, unknown>;
    if (!response.ok) {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    const expiresIn = typeof refreshed.expires_in === 'number' ? refreshed.expires_in : 1800;
    return {
      ...token,
      accessToken: refreshed.access_token || token.accessToken,
      accessTokenExpires: Date.now() + expiresIn * 1000,
      refreshToken: refreshed.refresh_token || token.refreshToken,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
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
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID
      ? [AzureADProvider({ clientId: process.env.AZURE_AD_CLIENT_ID, clientSecret: process.env.AZURE_AD_CLIENT_SECRET, tenantId: process.env.AZURE_AD_TENANT_ID })]
      : []),
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? [AppleProvider({ clientId: process.env.APPLE_CLIENT_ID, clientSecret: process.env.APPLE_CLIENT_SECRET })]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: THIRTY_MINUTES,
  },
  jwt: {
    maxAge: THIRTY_MINUTES,
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && typeof account.access_token === 'string') {
        (token as Record<string, unknown>)['accessToken'] = account.access_token;
        (token as Record<string, unknown>)['accessTokenExpires'] =
          typeof account.expires_at === 'number' ? account.expires_at * 1000 : Date.now() + THIRTY_MINUTES * 1000;
        if (account.refresh_token) {
          (token as Record<string, unknown>)['refreshToken'] = account.refresh_token;
        }
        (token as Record<string, unknown>)['provider'] = account.provider;
      }

      if (user) {
        token.id = (user as BasicAuthUser).id;
        const userRecord = user as unknown as Record<string, unknown>;
        if (userRecord && typeof userRecord['access_token'] === 'string') {
          (token as Record<string, unknown>)['accessToken'] = userRecord['access_token'] as string;
          (token as Record<string, unknown>)['accessTokenExpires'] = Date.now() + THIRTY_MINUTES * 1000;
        }
      }

      const tokenRecord = token as Record<string, unknown>;
      const expiresAt = tokenRecord['accessTokenExpires'] as number | undefined;
      if (expiresAt && Date.now() > expiresAt) {
        return await refreshAccessToken(tokenRecord);
      }

      return tokenRecord;
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
};

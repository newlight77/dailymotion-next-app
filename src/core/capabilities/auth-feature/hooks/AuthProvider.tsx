'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SessionProvider, signIn, signOut, useSession, getProviders, getSession } from 'next-auth/react';
import type { ClientSafeProvider } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from './AuthContext';
import type { AuthContextType, AuthLoginOptions, AuthLogoutOptions } from './AuthContext';
import type { AuthProviderId } from '../core/auth.constants';
import type { AuthenticatedUser, Credentials } from '../core/auth.entity';
import { prefixedKey } from '@/core/core-lib/shared/localStoragePrefix';

type Props = {
  children: React.ReactNode;
};

const AuthProviderInner: React.FC<Props> = ({ children }) => {
  const { data, status } = useSession();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getProviders().then((result) => setProviders(result || null));
  }, []);

  const user = useMemo<AuthenticatedUser | undefined>(() => {
    if (!data?.user) return undefined;
    return {
      id: (data.user as { id?: string }).id,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
    };
  }, [data?.user]);

  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(async (credentials?: Credentials, options?: AuthLoginOptions) => {
    setError(undefined);
    if (!credentials?.username || !credentials?.password) {
      setError('Missing username or password.');
      return;
    }

    // perform credential sign in without redirect so we can store token and redirect ourselves
    const res = await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      callbackUrl: options?.callbackUrl || '/',
      redirect: false,
    });

    if (res && (res as unknown as Record<string, unknown>)['ok']) {
      const session = await getSession();
      const sessionRecord = session as unknown as Record<string, unknown> | undefined;
      const token = (sessionRecord && typeof sessionRecord['accessToken'] === 'string')
        ? (sessionRecord['accessToken'] as string)
        : (sessionRecord?.['user'] && typeof (sessionRecord['user'] as Record<string, unknown>)['id'] === 'string')
          ? ((sessionRecord['user'] as Record<string, unknown>)['id'] as string)
          : undefined;
      if (token) {
        localStorage.setItem(prefixedKey('ACCESS_TOKEN'), token);
      }
      await router.push(options?.callbackUrl || '/');
      return;
    }

    setError('Authentication failed');
  }, [router]);

  const loginWithProvider = useCallback(async (provider: AuthProviderId, options?: AuthLoginOptions) => {
    setError(undefined);
    // for oauth providers we let provider redirect flow happen
    await signIn(provider, {
      callbackUrl: options?.callbackUrl || '/',
      redirect: true,
    });
  }, []);

  const logout = useCallback(async (options?: AuthLogoutOptions) => {
    setError(undefined);
    localStorage.removeItem(prefixedKey('ACCESS_TOKEN'));
    await signOut({
      callbackUrl: options?.callbackUrl || '/',
    });
  }, []);

  // store token when session becomes authenticated (covers oauth provider redirects)
  useEffect(() => {
    if (status === 'authenticated') {
      const dataRecord = data as unknown as Record<string, unknown> | undefined;
      const token = (dataRecord && typeof dataRecord['accessToken'] === 'string')
        ? (dataRecord['accessToken'] as string)
        : (dataRecord?.['user'] && typeof (dataRecord['user'] as Record<string, unknown>)['id'] === 'string')
          ? ((dataRecord['user'] as Record<string, unknown>)['id'] as string)
          : undefined;
      if (token) localStorage.setItem(prefixedKey('ACCESS_TOKEN'), token);
      // if user is on signin/signup page, redirect to home
      if (pathname === '/signin' || pathname === '/signup') {
        router.push('/');
      }
    }
  }, [status, data, router, pathname]);

  const value = useMemo<AuthContextType>(() => ({
    status,
    user,
    error,
    providers,
    login,
    loginWithProvider,
    logout,
  }), [status, user, error, providers, login, loginWithProvider, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
};

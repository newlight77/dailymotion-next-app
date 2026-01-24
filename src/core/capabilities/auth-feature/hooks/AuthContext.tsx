'use client'
import { createContext } from 'react';
import type { ClientSafeProvider } from 'next-auth/react';
import type { AuthenticatedUser, Credentials } from '../core/auth.entity';
import type { AuthProviderId } from '../core/auth.constants';

export type AuthLoginOptions = {
  callbackUrl?: string;
};

export type AuthLogoutOptions = {
  callbackUrl?: string;
};

export interface AuthContextType {
  status: 'authenticated' | 'unauthenticated' | 'loading';
  user?: AuthenticatedUser;
  error?: string;
  providers?: Record<string, ClientSafeProvider> | null;
  login: (credentials?: Credentials, options?: AuthLoginOptions) => Promise<void>;
  loginWithProvider: (provider: AuthProviderId, options?: AuthLoginOptions) => Promise<void>;
  logout: (options?: AuthLogoutOptions) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  status: 'unauthenticated',
  user: undefined,
  error: undefined,
  providers: null,
  login: async () => {},
  loginWithProvider: async () => {},
  logout: async () => {},
});

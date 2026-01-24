'use client'
import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks';
import { AUTH_PROVIDERS } from '../core/auth.constants';
import PasswordInput from '@/components/molecules/PasswordInput';

type Props = {
  redirectPathName?: string;
};

export const SigninWithSocialForm: React.FC<Props> = ({ redirectPathName }) => {
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const providerKeys = useMemo(() => Object.keys(auth.providers || {}), [auth.providers]);
  const hasGoogle = providerKeys.includes(AUTH_PROVIDERS.google);
  const hasMicrosoft = providerKeys.includes(AUTH_PROVIDERS.microsoft);
  const hasApple = providerKeys.includes(AUTH_PROVIDERS.apple);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    auth.login({ username, password }, { callbackUrl: redirectPathName });
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-md rounded-lg border border-secondary-variant bg-secondary/40 p-6 shadow-md">
      <header className="mb-6 space-y-1 text-center">
        <h1 className="text-2xl font-bold text-tertiary self-center">Sign in</h1>
        <p className="text-sm text-tertiary/80">Continue with a social provider or sign in with username and password.</p>
      </header>

      <div className="mb-6 grid gap-3">
        {hasGoogle && (
          <button
            type="button"
            className="w-full rounded-md border border-tertiary-variant bg-secondary-variant px-4 py-2 text-sm font-semibold text-tertiary hover:bg-secondary"
            onClick={() => auth.loginWithProvider(AUTH_PROVIDERS.google, { callbackUrl: redirectPathName })}
          >
            Continue with Google
          </button>
        )}
        {hasMicrosoft && (
          <button
            type="button"
            className="w-full rounded-md border border-tertiary-variant bg-secondary-variant px-4 py-2 text-sm font-semibold text-tertiary hover:bg-secondary"
            onClick={() => auth.loginWithProvider(AUTH_PROVIDERS.microsoft, { callbackUrl: redirectPathName })}
          >
            Continue with Microsoft
          </button>
        )}
        {hasApple && (
          <button
            type="button"
            className="w-full rounded-md border border-tertiary-variant bg-secondary-variant px-4 py-2 text-sm font-semibold text-tertiary hover:bg-secondary"
            onClick={() => auth.loginWithProvider(AUTH_PROVIDERS.apple, { callbackUrl: redirectPathName })}
          >
            Continue with Apple
          </button>
        )}
      </div>

      <div className="my-6 flex items-center gap-3 text-tertiary/60">
        <span className="h-px flex-1 bg-tertiary/10" />
        <span className="text-xs uppercase tracking-widest">or</span>
        <span className="h-px flex-1 bg-tertiary/10" />
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm text-tertiary">
          Username
          <input
            className="rounded-md border border-tertiary-variant bg-secondary px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
          />
        </label>
        <label className="grid gap-1 text-sm text-tertiary">
          Password
          <PasswordInput
            inputClassName="rounded-md border border-tertiary-variant bg-secondary px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>
        {auth.error && <p className="text-xs text-red-400">{auth.error}</p>}
        <button
          type="submit"
          className="inline-block mt-2 rounded-md border border-tertiary-variant px-4 py-2 text-sm font-semibold text-tertiary"
          disabled={auth.status === 'loading'}
        >
          Sign in
        </button>

        <div className="mt-2 text-center">
          <p className="text-sm text-tertiary/80">New here?</p>
          <a href="/signup" className="inline-block mt-2 rounded-md border border-tertiary-variant px-4 py-2 text-sm font-semibold text-tertiary hover:bg-secondary-variant">Create an account</a>
        </div>
      </form>
    </section>
  );
};

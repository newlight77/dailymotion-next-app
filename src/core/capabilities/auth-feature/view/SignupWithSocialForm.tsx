'use client'
import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks';
import { AUTH_PROVIDERS } from '../core/auth.constants';
import PasswordInput from '@/components/molecules/PasswordInput';

type Props = {
  redirectPathName?: string;
};

export const SignupWithSocialForm: React.FC<Props> = ({ redirectPathName }) => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const providerKeys = useMemo(() => Object.keys(auth.providers || {}), [auth.providers]);
  const hasGoogle = providerKeys.includes(AUTH_PROVIDERS.google);
  const hasMicrosoft = providerKeys.includes(AUTH_PROVIDERS.microsoft);
  const hasApple = providerKeys.includes(AUTH_PROVIDERS.apple);

  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?`~]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!isPasswordValid) {
      setErrorMessage('Password does not meet requirements.');
      return;
    }
    if (!email || !firstName || !lastName) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setErrorMessage(payload?.error || 'Signup failed.');
        return;
      }

      await auth.login(
        { username: email, password },
        { callbackUrl: redirectPathName }
      );
    } catch {
      setErrorMessage('Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-md rounded-lg border border-secondary-variant bg-secondary/40 p-6 shadow-md">
      <header className="mb-6 space-y-1 text-center">
        <h1 className="text-2xl font-bold text-tertiary">Sign up</h1>
        <p className="text-sm text-tertiary/80">Create an account using a social provider or your email.</p>
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
          First name
          <input
            className="rounded-md border border-tertiary-variant bg-secondary px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Jane"
            autoComplete="given-name"
          />
        </label>
        <label className="grid gap-1 text-sm text-tertiary">
          Last name
          <input
            className="rounded-md border border-tertiary-variant bg-secondary px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Doe"
            autoComplete="family-name"
          />
        </label>
        <label className="grid gap-1 text-sm text-tertiary">
          Email
          <input
            className="rounded-md border border-tertiary-variant bg-secondary px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="grid gap-1 text-sm text-tertiary">
          Password
          <PasswordInput
            inputClassName="rounded-md border border-tertiary-variant bg-secondary px-3 py-2 text-sm text-tertiary outline-none focus:border-primary"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </label>

        <div className="text-sm text-tertiary/80">
          <p className="mb-2">Password must contain:</p>
          <ul className="ml-4 list-disc">
            <li className={`${passwordCriteria.length ? 'text-green-400' : 'text-red-400'}`}>At least 8 characters</li>
            <li className={`${passwordCriteria.uppercase ? 'text-green-400' : 'text-red-400'}`}>One uppercase letter</li>
            <li className={`${passwordCriteria.digit ? 'text-green-400' : 'text-red-400'}`}>One digit</li>
            <li className={`${passwordCriteria.special ? 'text-green-400' : 'text-red-400'}`}>One special character : !@#$%^&*_-+</li>
          </ul>
        </div>

        {(errorMessage || auth.error) && (
          <p className="text-xs text-red-400">{errorMessage || auth.error}</p>
        )}
        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-secondary"
          disabled={auth.status === 'loading' || isSubmitting || !isPasswordValid}
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </section>
  );
};

'use client'
import React from 'react';
import { useAuth } from '../../hooks';

type Props = {
  className?: string;
  label?: string;
  redirectPathName?: string;
};

export const SignoutButton: React.FC<Props> = ({ className, label = 'Sign out', redirectPathName }) => {
  const auth = useAuth();

  if (auth.status !== 'authenticated') return null;

  return (
    <button
      type="button"
      className={`rounded-md border border-tertiary-variant px-4 py-2 text-sm font-semibold text-tertiary hover:bg-secondary-variant ${className || ''}`}
      onClick={() => auth.logout({ callbackUrl: redirectPathName || '/' })}
    >
      {label}
    </button>
  );
};

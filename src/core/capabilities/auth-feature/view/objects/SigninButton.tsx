'use client'
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks';

type Props = {
  className?: string;
  label?: string;
};

export const SigninButton: React.FC<Props> = ({ className, label = 'Sign in' }) => {
  const auth = useAuth();

  if (auth.status === 'authenticated') return null;

  return (
    <Link
      href="/signin"
      className={`rounded-md border border-tertiary-variant px-4 py-2 text-sm font-semibold text-tertiary bg-primary-variant hover:bg-secondary-variant ${className || ''}`}
    >
      {label}
    </Link>
  );
};

'use client'
import React from 'react';
import { AuthProvider } from '../hooks';

type Props = {
  children: React.ReactNode;
};

export const AuthModule: React.FC<Props> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export * from './SigninWithSocialForm';
export * from './SignupWithSocialForm';
export * from './objects/SigninButton';
export * from './objects/SignoutButton';

import React from 'react';
import { SigninWithSocialForm } from '@/core/capabilities/auth-feature/view';

const SigninPage = () => {
  return (
    <div className="main min-h-screen">
      <SigninWithSocialForm redirectPathName="/" />
    </div>
  );
};

export default SigninPage;

import React from 'react';
import { SignupWithSocialForm } from '@/core/capabilities/auth-feature/view';

const SignupPage = () => {
  return (
    <div className="main min-h-screen">
      <SignupWithSocialForm redirectPathName="/" />
    </div>
  );
};

export default SignupPage;

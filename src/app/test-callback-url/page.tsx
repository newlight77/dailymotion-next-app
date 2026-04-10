import React from 'react';

const CREDIT_URL = 'https://app.staging.lfpe.fr/credit';

const TestCallbackUrlPage = () => {
  return (
    <div className="main min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-lg font-semibold text-foreground">Test callback URL</h1>
      <a
        href={CREDIT_URL}
        className="inline-flex rounded-md border border-tertiary-variant px-4 py-2 text-sm font-semibold text-tertiary bg-primary-variant hover:bg-secondary-variant"
      >
        Go to staging credit
      </a>
    </div>
  );
};

export default TestCallbackUrlPage;

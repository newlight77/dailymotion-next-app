export const AUTH_PROVIDERS = {
  basic: 'credentials',
  google: 'google',
  microsoft: 'azure-ad',
  apple: 'apple',
} as const;

export type AuthProviderId = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

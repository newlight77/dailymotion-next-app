export type Role = 'user' | 'admin' | string;

export type AuthenticatedUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: Role[];
};

export type Credentials = {
  username: string;
  password: string;
};

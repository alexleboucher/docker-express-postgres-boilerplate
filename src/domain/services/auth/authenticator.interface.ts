import type { User } from '@/domain/models/user';

export type AuthenticateResponse = {
  success: true;
  user: User;
  token: string;
} | {
  success: false;
};

export type GetAuthenticatedUserResponse = {
  success: true;
  user: User;
} | {
  success: false;
  reason: 'InvalidToken' | 'UserNotFound';
};

export interface IAuthenticator {
  authenticate: (email: string, password: string) => Promise<AuthenticateResponse>;
  getAuthenticatedUser: (token: string) => Promise<GetAuthenticatedUserResponse>;
}
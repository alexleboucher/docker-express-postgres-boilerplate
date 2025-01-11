/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from '@/domain/models/user';

export type AuthenticateResponse = {
  err?: any;
  user?: User | false | null;
};

export interface IAuthenticator {
  configure: () => void;
  session: () => any;
  authenticateLocal: (req: any, res: any, next: any) => Promise<AuthenticateResponse>;
  isAuthenticated: (req: any) => boolean;
  logout: (req: any) => Promise<void>;
}
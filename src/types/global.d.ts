import type { RequestUser } from '@/domain/models/request-user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser | null;
  }
}
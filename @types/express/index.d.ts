import type { RequestUser } from '@/domain/models';

declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser;
  }
}
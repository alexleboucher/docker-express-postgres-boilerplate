import { injectable } from 'inversify';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/app/http-error';

export interface IAuthenticatedMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void;
}

@injectable()
export class AuthenticatedMiddleware implements IAuthenticatedMiddleware {
  handler(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      throw HttpError.forbidden('User must be authenticated');
    }

    next();
  }
}
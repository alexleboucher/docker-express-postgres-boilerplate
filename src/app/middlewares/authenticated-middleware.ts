import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/app/http-error';

@injectable()
export class AuthenticatedMiddleware extends BaseMiddleware {
  handler(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      throw HttpError.forbidden('User must be authenticated');
    }

    next();
  }
}
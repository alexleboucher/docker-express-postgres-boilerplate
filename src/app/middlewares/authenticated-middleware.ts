import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/app/http-error';
import type { IAuthenticator } from '@/domain/services/auth';
import { SERVICES_DI_TYPES } from '@/container/di-types';

@injectable()
export class AuthenticatedMiddleware extends BaseMiddleware {
  constructor(
    @inject(SERVICES_DI_TYPES.Authenticator) private readonly authenticator: IAuthenticator,
  ) {
    super();
  }

  handler(req: Request, res: Response, next: NextFunction) {
    if (!this.authenticator.isAuthenticated(req)) {
      throw HttpError.forbidden('User must be authenticated');
    }

    next();
  }
}
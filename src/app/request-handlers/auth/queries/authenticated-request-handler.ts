import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers';
import { SERVICES_DI_TYPES } from '@/container/di-types';
import type { IAuthenticator } from '@/domain/services/auth';

type ResponseBody = {
  authenticated: boolean;
};

// This handler, like the other auth handlers, is a bit special because it doesn't
// execute a use case. Instead, it interacts directly with the authenticator, as
// it requires access to req, res, and next, which are not the responsibility of the domain layer.
@injectable()
export class AuthenticatedRequestHandler implements IRequestHandler<ResponseBody> {
  constructor(
    @inject(SERVICES_DI_TYPES.Authenticator) private readonly authenticator: IAuthenticator,
  ) {}

  handle(req: Request, res: Response<ResponseBody>) {
    res.send({
      authenticated: this.authenticator.isAuthenticated(req),
    });
  }
}
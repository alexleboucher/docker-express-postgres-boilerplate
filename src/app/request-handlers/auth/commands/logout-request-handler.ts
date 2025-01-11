import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';

type ResponseBody = {
  success: boolean;
};

// This handler, like the other auth handlers, is a bit special because it doesn't
// execute a use case. Instead, it interacts directly with the authenticator, as
// it requires access to req, res, and next, which are not the responsibility of the domain layer.
@injectable()
export class LogoutRequestHandler implements IRequestHandler {
  constructor(
    @inject(SERVICES_DI_TYPES.Authenticator) private readonly authenticator: IAuthenticator,
  ) {}

  async handle(req: Request, res: Response<ResponseBody>) {
    await this.authenticator.logout(req);

    const response: ResponseBody = {
      success: true,
    };

    res.send(response);
  }
}
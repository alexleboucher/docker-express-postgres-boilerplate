import { inject, injectable } from 'inversify';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import type { IRequestHandler } from '@/app/request-handlers';
import type { IAuthenticator } from '@/domain/services/auth';
import { HttpError } from '@/app/http-error';
import { SERVICES_DI_TYPES } from '@/container/di-types';

type ResponseBody = {
  id: string;
  username: string;
  email: string;
};

const payloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// This handler, like the other auth handlers, is a bit special because it doesn't
// execute a use case. Instead, it interacts directly with the authenticator, as
// it requires access to req, res, and next, which are not the responsibility of the domain layer.
@injectable()
export class LoginRequestHandler implements IRequestHandler {
  constructor(
    @inject(SERVICES_DI_TYPES.Authenticator) private readonly authenticator: IAuthenticator,
  ) {}

  async handle(req: Request, res: Response<ResponseBody>, next: NextFunction) {
    // We don't need to get the values because the authenticator will handle the authentication
    // but we validate the body to ensure the request is well-formed
    payloadSchema.parse(req.body);

    const { err, user } = await this.authenticator.authenticateLocal(req, res, next);

    if (err) {
      throw err;
    }

    if (!user) {
      throw HttpError.unauthorized('Incorrect credentials');
    }

    const response: ResponseBody = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    res.send(response);
  }
}
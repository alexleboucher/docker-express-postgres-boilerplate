import { inject, injectable } from 'inversify';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import { HttpError } from '@/app/http-error';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { LoginUseCaseFailure, LoginUseCasePayload, LoginUseCaseSuccess } from '@/domain/use-cases/auth/login-use-case';

type ResponseBody = {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
};

const payloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

@injectable()
export class LoginRequestHandler implements IRequestHandler {
  constructor(
    @inject(USE_CASES_DI_TYPES.LoginUseCase) private readonly loginUseCase: IUseCase<LoginUseCasePayload, LoginUseCaseSuccess, LoginUseCaseFailure>,
  ) {}

  async handle(req: Request, res: Response<ResponseBody>, next: NextFunction) {
    // We don't need to get the values because the authenticator will handle the authentication
    // but we validate the body to ensure the request is well-formed
    const { email, password } = payloadSchema.parse(req.body);

    const result = await this.loginUseCase.execute({ email, password });

    if (result.isSuccess()) {
      const { user, token } = result.value;

      const response: ResponseBody = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      };

      res.status(200).send(response);
      return;
    } else if (result.isFailure()) {
      const failure = result.failure;

      switch (failure.reason) {
        case 'InvalidCredentials':
          throw HttpError.unauthorized('Incorrect credentials');
        case 'UnknownError':
          throw failure.error;
      }
    }
  }
}
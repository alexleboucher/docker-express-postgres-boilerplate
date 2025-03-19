import { inject, injectable } from 'inversify';
import { z } from 'zod';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { CreateUserUseCaseFailure, CreateUserUseCasePayload, CreateUserUseCaseSuccess } from '@/domain/use-cases/user/create-user-use-case';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import { HttpError } from '@/app/http-error';

type ResponseBody = {
  id: string;
  username: string;
  email: string;
};

const payloadSchema = z.object({
  email: z.string().email(),
  username: z.string().min(5),
  password: z.string().min(8),
});

@injectable()
export class CreateUserRequestHandler implements IRequestHandler {
  constructor(
    @inject(USE_CASES_DI_TYPES.CreateUserUseCase) private readonly createUserUseCase: IUseCase<CreateUserUseCasePayload, CreateUserUseCaseSuccess, CreateUserUseCaseFailure>,
  ) {}

  async handler(req: Request, res: Response<ResponseBody>) {
    const { email, username, password } = payloadSchema.parse(req.body);

    const result = await this.createUserUseCase.execute({
      email,
      username,
      password,
    });

    if (result.isSuccess()) {
      const user = result.value.user;

      const response: ResponseBody = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      res.status(201).send(response);
      return;
    } else if (result.isFailure()) {
      const failure = result.failure;

      switch (failure.reason) {
        case 'EmailAlreadyExists':
          throw HttpError.conflict('Email already exists');
        case 'UsernameAlreadyExists':
          throw HttpError.conflict('Username already exists');
        case 'UnknownError':
          throw failure.error;
      }
    }
  }
}
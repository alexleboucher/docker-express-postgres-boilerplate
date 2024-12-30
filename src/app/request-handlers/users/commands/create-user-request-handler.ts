import { inject, injectable } from 'inversify';
import { z } from 'zod';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers';
import type { IUseCase } from '@/core/use-case';
import { USE_CASES_DI_TYPES } from '@/container/di-types';
import type { CreateUserCasePayload } from '@/domain/use-cases/user/';
import type { User } from '@/domain/models';

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
    @inject(USE_CASES_DI_TYPES.CreateUserUseCase) private readonly createUserUseCase: IUseCase<CreateUserCasePayload, User>,
  ) {}

  async handle(req: Request, res: Response<ResponseBody>) {
    const { email, username, password } = payloadSchema.parse(req.body);

    const result = await this.createUserUseCase.execute({
      email,
      username,
      password,
    });

    if (result.isSuccess()) {
      const user = result.value;

      const response: ResponseBody = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      res.status(201).send(response);
      return;
    } else {
      throw result.error;
    }
  }
}
import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { GetCurrentUserUseCaseFailure, GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess } from '@/domain/use-cases/auth/get-current-user-use-case';

export interface ICurrentUserMiddleware {
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

@injectable()
export class CurrentUserMiddleware implements ICurrentUserMiddleware {
  constructor(
    @inject(USE_CASES_DI_TYPES.GetCurrentUserUseCase) private readonly getCurrentUserUseCase: IUseCase<GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess, GetCurrentUserUseCaseFailure>,
  ) {}

  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      req.user = null;

      const authHeader = req.headers.authorization;

      if (authHeader) {
        const [type, token] = authHeader.split(' ');

        if (type === 'Bearer' && token) {
          const result = await this.getCurrentUserUseCase.execute({ token });
          if (result.isSuccess()) {
            req.user = result.value.user;
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
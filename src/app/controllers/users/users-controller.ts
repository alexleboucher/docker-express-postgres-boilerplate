import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost } from 'inversify-express-utils';
import type { NextFunction, Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/di-types';

@controller('/users')
export class UsersController extends BaseHttpController {
  constructor(
    @inject(REQUEST_HANDLERS_DI_TYPES.CreateUserRequestHandler) private readonly createUserUseCase: IRequestHandler,
  ) {
    super();
  }

  @httpPost('')
  public async create(req: Request, res: Response, next: NextFunction) {
    return this.createUserUseCase.handle(req, res, next);
  }
}
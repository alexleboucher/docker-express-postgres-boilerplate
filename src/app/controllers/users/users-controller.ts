import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost } from 'inversify-express-utils';
import type { NextFunction, Request, Response } from 'express';

import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';
import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

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
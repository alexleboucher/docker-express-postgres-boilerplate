import { inject, injectable } from 'inversify';

import { BaseRouter } from '@/app/routers/base-router';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';
import { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

@injectable()
class UsersRouter extends BaseRouter {
  constructor(
    @inject(REQUEST_HANDLERS_DI_TYPES.CreateUserRequestHandler) private readonly createUserRequestHandler: IRequestHandler,
  ) {
    super();
  }

  setupRoutes() {
    this.router.route('/').post(this.createUserRequestHandler.handler.bind(this.createUserRequestHandler));
  }
}

export { UsersRouter };

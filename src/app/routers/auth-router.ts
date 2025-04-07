import { inject, injectable } from 'inversify';

import { BaseRouter } from '@/app/routers/base-router';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';
import { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

@injectable()
class AuthRouter extends BaseRouter {
  constructor(
    @inject(REQUEST_HANDLERS_DI_TYPES.LoginRequestHandler) private readonly loginRequestHandler: IRequestHandler,
    @inject(REQUEST_HANDLERS_DI_TYPES.AuthenticatedRequestHandler) private readonly authenticatedRequestHandler: IRequestHandler,
  ) {
    super();
  }

  setupRoutes() {
    this.router.route('/login').post(this.loginRequestHandler.handler.bind(this.loginRequestHandler));
    this.router.route('/authenticated').get(this.authenticatedRequestHandler.handler.bind(this.authenticatedRequestHandler));
  }
}

export { AuthRouter };

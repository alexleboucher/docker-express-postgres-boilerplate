import { inject, injectable } from 'inversify';
import 'express-async-errors';

import { BaseRouter } from '@/app/routers/base-router';
import { ROUTERS_DI_TYPES } from '@/container/routers/di-types';

@injectable()
class ApiRouter extends BaseRouter {
  constructor(
    @inject(ROUTERS_DI_TYPES.AuthRouter) private readonly authRouter: BaseRouter,
    @inject(ROUTERS_DI_TYPES.UsersRouter) private readonly usersRouter: BaseRouter,
    @inject(ROUTERS_DI_TYPES.HealthRouter) private readonly healthRouter: BaseRouter,
  ) {
    super();
  }

  setupRoutes() {
    this.router.use('/auth', this.authRouter.getRouter());
    this.router.use('/users', this.usersRouter.getRouter());
    this.router.use('/health', this.healthRouter.getRouter());
  }
}

export { ApiRouter };

import { inject, injectable } from 'inversify';

import { BaseRouter } from '@/app/routers/base-router';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';
import { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

@injectable()
class HealthRouter extends BaseRouter {
  constructor(
    @inject(REQUEST_HANDLERS_DI_TYPES.HealthRequestHandler) private readonly healthRequestHandler: IRequestHandler,
  ) {
    super();
  }

  setupRoutes() {
    this.router.route('/').get(this.healthRequestHandler.handler.bind(this.healthRequestHandler));
  }
}

export { HealthRouter };

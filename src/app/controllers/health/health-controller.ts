import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';
import type { NextFunction, Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/di-types';

@controller('/health')
export class HealthController extends BaseHttpController {
  constructor(
    @inject(REQUEST_HANDLERS_DI_TYPES.HealthRequestHandler) private readonly healthRequestHandler: IRequestHandler,
  ) {
    super();
  }

  @httpGet('')
  public health(req: Request, res: Response, next: NextFunction) {
    return this.healthRequestHandler.handle(req, res, next);
  }
}
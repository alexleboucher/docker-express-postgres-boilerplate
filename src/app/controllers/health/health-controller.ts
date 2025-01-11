import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';
import type { NextFunction, Request, Response } from 'express';

import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';
import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

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
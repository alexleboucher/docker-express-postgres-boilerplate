import { injectable } from 'inversify';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers';

type ResponseBody = {
  success: boolean;
};

@injectable()
export class HealthRequestHandler implements IRequestHandler {
  handle(req: Request, res: Response<ResponseBody>) {
    const response: ResponseBody = {
      success: true,
    };

    res.send(response);
  }
}
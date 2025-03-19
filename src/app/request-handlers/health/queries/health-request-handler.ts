import { injectable } from 'inversify';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

type ResponseBody = {
  success: boolean;
};

@injectable()
export class HealthRequestHandler implements IRequestHandler {
  handler(req: Request, res: Response<ResponseBody>) {
    const response: ResponseBody = {
      success: true,
    };

    res.send(response);
  }
}
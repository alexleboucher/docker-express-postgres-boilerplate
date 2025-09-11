import { injectable } from 'inversify';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

type ResponseBody = {
  success: boolean;
};

let a = { a: 'aaaaa', u: 'aaaaa', aaa: 'ffff' };

let b = {
  a: 'aaaaa',
  u: 'aaaaa',
  aaa: 'ffff'
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
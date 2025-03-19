import { injectable } from 'inversify';
import type { Request, Response } from 'express';

import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';

type ResponseBody = {
  authenticated: boolean;
};

// This request handler doesn't execute a use case because it's very simple and doesn't need to
// do anything with the domain layer.
@injectable()
export class AuthenticatedRequestHandler implements IRequestHandler<ResponseBody> {
  handler(req: Request, res: Response<ResponseBody>) {
    res.send({
      authenticated: Boolean(req.user),
    });
  }
}
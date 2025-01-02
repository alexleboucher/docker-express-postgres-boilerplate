import type { Request, Response, NextFunction } from 'express';

export interface IRequestHandler<TResponseBody extends object = never> {
  handle(req: Request, res: Response<TResponseBody>, next: NextFunction): void | Promise<void>;
}
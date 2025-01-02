/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, injectable } from 'inversify';
import { ZodError } from 'zod';
import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/app/http-error';
import type { ILogger } from '@/core/logger';
import { CORE_DI_TYPES } from '@/container/di-types';

type FormatedError = {
  message: string;
  name: string;
  status: number;
};

export interface IErrorMiddleware {
  handler: (err: any, req: Request, res: Response, next: NextFunction) => void;
}

@injectable()
export class ErrorMiddleware implements IErrorMiddleware {
  constructor(
    @inject(CORE_DI_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  private logError(httpError: HttpError) {
    this.logger.error('Http error caught by error middleware:', {
      status: httpError.status,
      name: httpError.name,
      message: httpError.message,
      ...(httpError.error && {
        error: {
          name: httpError.error.name,
          message: httpError.error.message,
          stack: httpError.error.stack,
        }
      })
    });
  }

  handler(err: any, req: Request, res: Response<FormatedError>, next: NextFunction) {
    let error: HttpError;
    if (err instanceof HttpError) {
      error = err;
    } else if (err instanceof ZodError) {
      const zodError = JSON.parse(err.message)[0];
      error = HttpError.badRequest(`Path: ${zodError.path}. Message: ${zodError.message}`);
    } else {
      // if the error is not an HttpError or ZodError, it means the error is not handled,
      // so we throw an internal server error
      const message = err.message ?? 'Internal server error';
      error = HttpError.internalServerError(message, err);
    }

    this.logError(error);

    const formatedError: FormatedError = {
      message: error.message,
      name: error.name,
      status: error.status,
    };

    res.status(error.status).send(formatedError);
  }
}
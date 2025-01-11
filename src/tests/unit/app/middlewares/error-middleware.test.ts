import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import type { ILogger } from '@/core/logger/logger.interface';
import { ErrorMiddleware } from '@/app/middlewares/error-middleware';

describe('ErrorMiddleware', () => {
  test('Send BadRequest error if ZodError is thrown', () => {
    const loggerMock = mock<ILogger>();

    const req = {} as Request;
    const res = mock<Response>();
    const next = jest.fn();
    res.status.mockReturnThis();

    const middleware = new ErrorMiddleware(loggerMock);
    middleware.handler(new ZodError([{ message: 'Schema error', code: 'custom', path: ['error path'] }]), req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Path: error path. Message: Schema error',
      name: 'BadRequest',
      status: 400,
    });
  });

  test('Send InternalServerError error if unknown error is thrown', () => {
    const loggerMock = mock<ILogger>();

    const req = {} as Request;
    const res = mock<Response>();
    const next = jest.fn();
    res.status.mockReturnThis();

    const middleware = new ErrorMiddleware(loggerMock);
    middleware.handler(new Error('Unknown error'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Unknown error',
      name: 'InternalServerError',
      status: 500,
    });
  });
});

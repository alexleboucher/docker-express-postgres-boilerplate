import type { Request, Response } from 'express';

import { AuthenticatedMiddleware } from '@/app/middlewares/authenticated-middleware';
import { HttpError } from '@/app/http-error';

describe('AuthenticatedMiddleware', () => {
  test('Call next if user is authenticated', () => {
    const req = {
      user: {
        id: '1',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = new AuthenticatedMiddleware();
    middleware.handler(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('Throw an error when user is not authenticated', () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = new AuthenticatedMiddleware();
    expect(() => middleware.handler(req, res, next)).toThrow(HttpError.forbidden('User must be authenticated'));
  });
});

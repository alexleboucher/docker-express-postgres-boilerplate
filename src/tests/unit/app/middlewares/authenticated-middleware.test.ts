import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import type { IAuthenticator } from '@/domain/services/auth';
import { AuthenticatedMiddleware } from '@/app/middlewares';
import { HttpError } from '@/app/http-error';

describe('AuthenticatedMiddleware', () => {
  test('Call next if user is authenticated', () => {
    const authenticatorMock = mock<IAuthenticator>();
    authenticatorMock.isAuthenticated.mockReturnValue(true);

    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = new AuthenticatedMiddleware(authenticatorMock);
    middleware.handler(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('Throw an error when user is not authenticated', () => {
    const authenticatorMock = mock<IAuthenticator>();
    authenticatorMock.isAuthenticated.mockReturnValue(false);

    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = new AuthenticatedMiddleware(authenticatorMock);
    expect(() => middleware.handler(req, res, next)).toThrow(HttpError.forbidden('User must be authenticated'));
  });
});

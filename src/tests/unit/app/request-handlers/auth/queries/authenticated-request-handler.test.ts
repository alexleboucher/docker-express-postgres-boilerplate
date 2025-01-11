import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import { AuthenticatedRequestHandler } from '@/app/request-handlers/auth/queries/authenticated-request-handler';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';

describe('AuthenticatedRequestHandler', () => {
  test('Send authenticated true', () => {
    const req = {} as Request;
    const res = mock<Response>();

    const authenticator = mock<IAuthenticator>();
    authenticator.isAuthenticated.mockReturnValue(true);

    const handler = new AuthenticatedRequestHandler(authenticator);
    handler.handle(req, res);

    expect(res.send).toHaveBeenCalledWith({
      authenticated: true,
    });
  });

  test('Send authenticated false', () => {
    const req = {} as Request;
    const res = mock<Response>();

    const authenticator = mock<IAuthenticator>();
    authenticator.isAuthenticated.mockReturnValue(false);

    const handler = new AuthenticatedRequestHandler(authenticator);
    handler.handle(req, res);

    expect(res.send).toHaveBeenCalledWith({
      authenticated: false,
    });
  });
});

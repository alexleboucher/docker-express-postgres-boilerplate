import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import { AuthenticatedRequestHandler } from '@/app/request-handlers/auth/queries/authenticated-request-handler';

describe('AuthenticatedRequestHandler', () => {
  test('Send authenticated true', () => {
    const req = {
      user: {
        id: '1',
      },
    } as Request;
    const res = mock<Response>();

    const handler = new AuthenticatedRequestHandler();
    handler.handler(req, res);

    expect(res.send).toHaveBeenCalledWith({
      authenticated: true,
    });
  });

  test('Send authenticated false', () => {
    const req = {} as Request;
    const res = mock<Response>();

    const handler = new AuthenticatedRequestHandler();
    handler.handler(req, res);

    expect(res.send).toHaveBeenCalledWith({
      authenticated: false,
    });
  });
});

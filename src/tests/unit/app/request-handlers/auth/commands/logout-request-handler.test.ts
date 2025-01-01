import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import type { IAuthenticator } from '@/domain/services/auth';
import { LogoutRequestHandler } from '@/app/request-handlers/auth';

describe('LogoutRequestHandler', () => {
  test('Call authenticator logout and send success response', async () => {
    const req = {} as Request;
    const res = mock<Response>();

    const authenticator = mock<IAuthenticator>();

    const handler = new LogoutRequestHandler(authenticator);
    await handler.handle(req, res);

    expect(authenticator.logout).toHaveBeenCalledWith(req);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
    });
  });
});

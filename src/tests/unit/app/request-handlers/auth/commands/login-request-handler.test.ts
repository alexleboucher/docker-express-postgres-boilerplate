import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import { HttpError } from '@/app/http-error';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';
import { User } from '@/domain/models/user';
import { LoginRequestHandler } from '@/app/request-handlers/auth/commands/login-request-handler';

describe('LoginRequestHandler', () => {
  test('Send user infos after login', async () => {
    const req = {
      body: {
        email: 'test@test.com',
        password: 'test_password',
      },
    } as Request;
    const res = mock<Response>();
    const next = jest.fn();

    const authenticator = mock<IAuthenticator>();
    authenticator.authenticateLocal.mockResolvedValue({
      err: null,
      user: new User({
        id: '1',
        username: 'test_username',
        email: 'test@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: 'test_hashpassword',
      }),
    });

    const handler = new LoginRequestHandler(authenticator);
    await handler.handle(req, res, next);

    expect(res.send).toHaveBeenCalledWith({
      id: '1',
      username: 'test_username',
      email: 'test@test.com',
    });
  });

  test('Send unauthorized error if credentials are incorrect', async () => {
    const req = {
      body: {
        email: 'test@test.com',
        password: 'test_password',
      },
    } as Request;
    const res = mock<Response>();
    const next = jest.fn();

    const authenticator = mock<IAuthenticator>();
    authenticator.authenticateLocal.mockResolvedValue({
      err: null,
      user: null,
    });

    const handler = new LoginRequestHandler(authenticator);
    await expect(handler.handle(req, res, next)).rejects.toStrictEqual(HttpError.unauthorized('Incorrect credentials'));
  });
});

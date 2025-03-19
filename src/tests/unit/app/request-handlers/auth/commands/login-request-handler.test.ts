import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import { HttpError } from '@/app/http-error';
import { User } from '@/domain/models/user';
import { LoginRequestHandler } from '@/app/request-handlers/auth/commands/login-request-handler';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import { Failure, Success } from '@/core/result/result';

describe('LoginRequestHandler', () => {
  test('Send user infos and token after login', async () => {
    const req = {
      body: {
        email: 'test@test.com',
        password: 'test_password',
      },
    } as Request;
    const res = mock<Response>();
    res.status.mockReturnThis();
    const next = jest.fn();

    const loginUseCase = mock<IUseCase>();
    loginUseCase.execute.mockResolvedValue(
      new Success({
        user: new User({
          id: '1',
          username: 'test_username',
          email: 'test@test.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          hashPassword: 'test_hashpassword',
        }),
        token: 'test_token',
      })
    );

    const handler = new LoginRequestHandler(loginUseCase);
    await handler.handler(req, res, next);

    expect(res.send).toHaveBeenCalledWith({
      user: {
        id: '1',
        username: 'test_username',
        email: 'test@test.com',
      },
      token: 'test_token',
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
    res.status.mockReturnThis();
    const next = jest.fn();

    const loginUseCase = mock<IUseCase>();
    loginUseCase.execute.mockResolvedValue(
      new Failure({
        reason: 'InvalidCredentials',
        error: new Error('Incorrect credentials'),
      }),
    );

    const handler = new LoginRequestHandler(loginUseCase);
    await expect(handler.handler(req, res, next)).rejects.toStrictEqual(HttpError.unauthorized('Incorrect credentials'));
  });
});

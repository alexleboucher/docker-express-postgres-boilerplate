import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import { CurrentUserMiddleware } from '@/app/middlewares/current-user-middleware';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { GetCurrentUserUseCaseFailure, GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess } from '@/domain/use-cases/auth/get-current-user-use-case';
import { Failure, Success } from '@/core/result/result';
import { User } from '@/domain/models/user';

describe('CurrentUserMiddleware', () => {
  test('Set user in request if token is valid', async () => {
    const getCurrentUserUseCase = mock<IUseCase<GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess, GetCurrentUserUseCaseFailure>>();

    const req = {
      headers: {
        authorization: 'Bearer token',
      },
    } as Request;
    const res = mock<Response>();
    const next = jest.fn();

    const user = new User({
      id: '1',
      username: 'test',
      email: 'test@test.com',
      hashPassword: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    getCurrentUserUseCase.execute.mockResolvedValue(new Success({ user }));

    const middleware = new CurrentUserMiddleware(getCurrentUserUseCase);
    await middleware.handler(req, res, next);

    expect(getCurrentUserUseCase.execute).toHaveBeenCalledWith({ token: 'token' });
    expect(req.user).toEqual(user);
  });

  test('Set user to null in request if token is invalid', async () => {
    const getCurrentUserUseCase = mock<IUseCase<GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess, GetCurrentUserUseCaseFailure>>();

    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    } as Request;
    const res = mock<Response>();
    const next = jest.fn();

    getCurrentUserUseCase.execute.mockResolvedValue(new Failure<GetCurrentUserUseCaseFailure>({
      reason: 'InvalidToken',
      error: new Error('Failed to get current user: InvalidToken'),
    }));

    const middleware = new CurrentUserMiddleware(getCurrentUserUseCase);
    await middleware.handler(req, res, next);

    expect(getCurrentUserUseCase.execute).toHaveBeenCalledWith({ token: 'invalid-token' });
    expect(req.user).toBeNull();
  });

  test('Set user to null in request if user is not found', async () => {
    const getCurrentUserUseCase = mock<IUseCase<GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess, GetCurrentUserUseCaseFailure>>();

    const req = {
      headers: {
        authorization: 'Bearer token',
      },
    } as Request;
    const res = mock<Response>();
    const next = jest.fn();

    getCurrentUserUseCase.execute.mockResolvedValue(new Failure<GetCurrentUserUseCaseFailure>({
      reason: 'UserNotFound',
      error: new Error('Failed to get current user: UserNotFound'),
    }));

    const middleware = new CurrentUserMiddleware(getCurrentUserUseCase);
    await middleware.handler(req, res, next);

    expect(getCurrentUserUseCase.execute).toHaveBeenCalledWith({ token: 'token' });
    expect(req.user).toBeNull();
  });

  test("Don't call use case and set user to null if token is not provided", async () => {
    const getCurrentUserUseCase = mock<IUseCase<GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess, GetCurrentUserUseCaseFailure>>();

    const req = {
      headers: {},
    } as Request;
    const res = mock<Response>();
    const next = jest.fn();

    const middleware = new CurrentUserMiddleware(getCurrentUserUseCase);
    await middleware.handler(req, res, next);

    expect(getCurrentUserUseCase.execute).not.toHaveBeenCalled();
    expect(req.user).toBeNull();
  });

  test("Don't call use case and set user to null if token is not Bearer", async () => {
    const getCurrentUserUseCase = mock<IUseCase<GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess, GetCurrentUserUseCaseFailure>>();

    const req = {
      headers: {
        authorization: 'Basic token',
      },
    } as Request;
    const res = mock<Response>();
    const next = jest.fn();

    const middleware = new CurrentUserMiddleware(getCurrentUserUseCase);
    await middleware.handler(req, res, next);

    expect(getCurrentUserUseCase.execute).not.toHaveBeenCalled();
    expect(req.user).toBeNull();
  });
});
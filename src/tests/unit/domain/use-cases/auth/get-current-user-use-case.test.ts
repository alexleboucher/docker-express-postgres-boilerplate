import { mock } from 'jest-mock-extended';

import { User } from '@/domain/models/user';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';
import type { GetCurrentUserUseCasePayload } from '@/domain/use-cases/auth/get-current-user-use-case';
import { GetCurrentUserUseCase } from '@/domain/use-cases/auth/get-current-user-use-case';
import { Failure, Success } from '@/core/result/result';

describe('GetCurrentUserUseCase', () => {
  test('Call authenticator and send success response', async () => {
    const authenticator = mock<IAuthenticator>();

    const user = new User({
      id: 'test_id',
      email: 'test@test.com',
      username: 'test_username',
      hashPassword: 'test_hash_password',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    });

    authenticator.getAuthenticatedUser.mockResolvedValue({
      success: true,
      user,
    });

    const useCase = new GetCurrentUserUseCase(authenticator);

    const payload: GetCurrentUserUseCasePayload = {
      token: 'test_token',
    };

    const result = await useCase.execute(payload);

    expect(authenticator.getAuthenticatedUser).toHaveBeenCalledWith(payload.token);
    expect(result).toStrictEqual(new Success({
      user,
    }));
  });

  test('Call authenticator and send failure response if token is invalid', async () => {
    const authenticator = mock<IAuthenticator>();

    authenticator.getAuthenticatedUser.mockResolvedValue({
      success: false,
      reason: 'InvalidToken',
    });

    const useCase = new GetCurrentUserUseCase(authenticator);

    const payload: GetCurrentUserUseCasePayload = {
      token: 'test_token',
    };

    const result = await useCase.execute(payload);

    expect(authenticator.getAuthenticatedUser).toHaveBeenCalledWith(payload.token);
    expect(result).toStrictEqual(new Failure({
      reason: 'InvalidToken',
      error: new Error('Failed to get current user: InvalidToken'),
    }));
  });

  test('Call authenticator and send failure response if user is not found', async () => {
    const authenticator = mock<IAuthenticator>();

    authenticator.getAuthenticatedUser.mockResolvedValue({
      success: false,
      reason: 'UserNotFound',
    });

    const useCase = new GetCurrentUserUseCase(authenticator);

    const payload: GetCurrentUserUseCasePayload = {
      token: 'test_token',
    };

    const result = await useCase.execute(payload);

    expect(authenticator.getAuthenticatedUser).toHaveBeenCalledWith(payload.token);
    expect(result).toStrictEqual(new Failure({
      reason: 'UserNotFound',
      error: new Error('Failed to get current user: UserNotFound'),
    }));
  });
});

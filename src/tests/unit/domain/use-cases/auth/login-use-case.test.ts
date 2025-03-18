import { mock } from 'jest-mock-extended';

import { Failure, Success } from '@/core/result/result';
import { User } from '@/domain/models/user';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';
import type { LoginUseCasePayload } from '@/domain/use-cases/auth/login-use-case';
import { LoginUseCase } from '@/domain/use-cases/auth/login-use-case';

describe('LoginUseCase', () => {
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

    authenticator.authenticate.mockResolvedValue({
      success: true,
      user,
      token: 'test_token',
    });

    const useCase = new LoginUseCase(authenticator);

    const payload: LoginUseCasePayload = {
      email: 'test@test.com',
      password: 'test_password',
    };

    const result = await useCase.execute(payload);

    expect(authenticator.authenticate).toHaveBeenCalledWith(payload.email, payload.password);
    expect(result).toStrictEqual(new Success({
      user,
      token: 'test_token',
    }));
  });

  test('Call authenticator and send failure response if credentials are invalid', async () => {
    const authenticator = mock<IAuthenticator>();

    authenticator.authenticate.mockResolvedValue({
      success: false,
    });

    const useCase = new LoginUseCase(authenticator);

    const payload: LoginUseCasePayload = {
      email: 'test@test.com',
      password: 'test_password',
    };

    const result = await useCase.execute(payload);

    expect(authenticator.authenticate).toHaveBeenCalledWith(payload.email, payload.password);
    expect(result).toStrictEqual(new Failure({
      reason: 'InvalidCredentials',
      error: new Error('Invalid credentials'),
    }));
  });
});
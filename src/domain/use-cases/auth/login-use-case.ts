import { inject, injectable } from 'inversify';

import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import type { User } from '@/domain/models/user';
import { Failure, Success } from '@/core/result/result';

export type LoginUseCasePayload = {
  email: string;
  password: string;
};

type LoginUseCaseFailureReason = 'InvalidCredentials' | 'UnknownError';
export type LoginUseCaseFailure = {
  reason: LoginUseCaseFailureReason;
  error: Error;
};

export type LoginUseCaseSuccess = {
  user: User;
  token: string;
};

@injectable()
export class LoginUseCase implements IUseCase<LoginUseCasePayload, LoginUseCaseSuccess, LoginUseCaseFailure> {
  constructor(
    @inject(SERVICES_DI_TYPES.Authenticator) private readonly authenticator: IAuthenticator,
  ) {}

  async execute(payload: LoginUseCasePayload) {
    try {
      const result = await this.authenticator.authenticate(payload.email, payload.password);
      if (!result.success) {
        return new Failure<LoginUseCaseFailure>({
          reason: 'InvalidCredentials',
          error: new Error('Invalid credentials'),
        });
      }

      const { user, token } = result;

      return new Success({ user, token });
    } catch (error) {
      return new Failure<LoginUseCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
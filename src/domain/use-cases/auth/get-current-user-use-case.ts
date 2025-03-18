import { inject, injectable } from 'inversify';

import type { IUseCase } from '@/core/use-case/use-case.interface';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import type { User } from '@/domain/models/user';
import { Failure, Success } from '@/core/result/result';

export type GetCurrentUserUseCasePayload = {
  token: string;
};

type GetCurrentUserUseCaseFailureReason = 'InvalidToken' | 'UserNotFound' | 'UnknownError';
export type GetCurrentUserUseCaseFailure = {
  reason: GetCurrentUserUseCaseFailureReason;
  error: Error;
};

export type GetCurrentUserUseCaseSuccess = {
  user: User;
};

@injectable()
export class GetCurrentUserUseCase implements IUseCase<GetCurrentUserUseCasePayload, GetCurrentUserUseCaseSuccess, GetCurrentUserUseCaseFailure> {
  constructor(
    @inject(SERVICES_DI_TYPES.Authenticator) private readonly authenticator: IAuthenticator,
  ) {}

  async execute(payload: GetCurrentUserUseCasePayload) {
    try {
      const result = await this.authenticator.getAuthenticatedUser(payload.token);
      if (result.success) {
        return new Success({ user: result.user });
      }

      return new Failure<GetCurrentUserUseCaseFailure>({
        reason: result.reason,
        error: new Error(`Failed to get current user: ${result.reason}`),
      });
    } catch (error) {
      return new Failure<GetCurrentUserUseCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
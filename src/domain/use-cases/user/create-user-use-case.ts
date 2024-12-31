import { inject, injectable } from 'inversify';

import { CORE_DI_TYPES, REPOSITORIES_DI_TYPES, SERVICES_DI_TYPES } from '@/container/di-types';
import type { IIDGenerator } from '@/core/id';
import type { ITime } from '@/core/time';
import type { IUseCase } from '@/core/use-case';
import { User } from '@/domain/models';
import type { IUserRepository } from '@/domain/repositories';
import type { IEncryptor } from '@/domain/services/security';
import { Failure, Success } from '@/core/result/result';

export type CreateUserCasePayload = {
  email: string;
  username: string;
  password: string;
};

type CreateUserCaseFailureReason = 'EmailAlreadyExists' | 'UsernameAlreadyExists' | 'UnknownError';
export type CreateUserCaseFailure = {
  reason: CreateUserCaseFailureReason;
  error: Error;
};

export type CreateUserCaseSuccess = {
  user: User;
};

@injectable()
export class CreateUserUseCase implements IUseCase<CreateUserCasePayload, CreateUserCaseSuccess, CreateUserCaseFailure> {
  constructor(
    @inject(CORE_DI_TYPES.IDGenerator) private readonly idGenerator: IIDGenerator,
    @inject(CORE_DI_TYPES.Time) private readonly time: ITime,
    @inject(SERVICES_DI_TYPES.Encryptor) private readonly encryptor: IEncryptor,
    @inject(REPOSITORIES_DI_TYPES.UserRepository) private readonly userRepository: IUserRepository,
  ) {}

  async execute(payload: CreateUserCasePayload) {
    try {
      const emailExists = await this.userRepository.existsByEmail(payload.email);
      if (emailExists) {
        return new Failure<CreateUserCaseFailure>({
          reason: 'EmailAlreadyExists',
          error: new Error('Email already exists'),
        });
      }

      const usernameExists = await this.userRepository.existsByUsername(payload.username);
      if (usernameExists) {
        return new Failure<CreateUserCaseFailure>({
          reason: 'UsernameAlreadyExists',
          error: new Error('Username already exists'),
        });
      }

      const hashPassword = await this.encryptor.hashPassword(payload.password);

      const user = new User({
        id: this.idGenerator.generate(),
        email: payload.email,
        username: payload.username,
        hashPassword,
        createdAt: this.time.now(),
        updatedAt: this.time.now(),
      });

      const newUser = await this.userRepository.create(user);

      return new Success({ user: newUser });
    } catch (error) {
      return new Failure<CreateUserCaseFailure>({
        reason: 'UnknownError',
        error: error as Error,
      });
    }
  }
}
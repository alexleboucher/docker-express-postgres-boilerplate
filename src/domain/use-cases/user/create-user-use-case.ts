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

@injectable()
export class CreateUserUseCase implements IUseCase<CreateUserCasePayload, User> {
  constructor(
    @inject(CORE_DI_TYPES.IDGenerator) private readonly idGenerator: IIDGenerator,
    @inject(CORE_DI_TYPES.Time) private readonly time: ITime,
    @inject(SERVICES_DI_TYPES.Encryptor) private readonly encryptor: IEncryptor,
    @inject(REPOSITORIES_DI_TYPES.UserRepository) private readonly userRepository: IUserRepository,
  ) {}

  async execute(payload: CreateUserCasePayload) {
    try {
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

      return new Success(newUser);
    } catch (error) {
      return new Failure(error as Error);
    }
  }
}
import { CORE_DI_TYPES } from '@/container/core/di-types';
import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import type { IIDGenerator } from '@/core/id/id-generator.interface';
import { User } from '@/domain/models/user';
import type { IUserRepository } from '@/domain/repositories/user-repository.interface';
import type { IEncryptor } from '@/domain/services/security/encryptor.interface';
import type { TestEnvironment } from '@/tests/helpers/test-environment';

export interface CreateTestUserOptions {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * Create a user in database.
 * @param testUser - User informations. Optional.
 * @returns The created user
 */
export const createTestUser = async (TestEnvironment: TestEnvironment, options?: CreateTestUserOptions) => {
  const idGenerator = TestEnvironment.container.get<IIDGenerator>(CORE_DI_TYPES.IDGenerator);
  const userRepo = TestEnvironment.container.get<IUserRepository>(REPOSITORIES_DI_TYPES.UserRepository);
  const encryptor = TestEnvironment.container.get<IEncryptor>(SERVICES_DI_TYPES.Encryptor);

  const user = new User({
    id: options?.id ?? idGenerator.generate(),
    username: options?.username ?? 'fakeUser',
    email: options?.email ?? 'fakeUser@test.com',
    hashPassword: await encryptor.hashPassword(options?.password ?? 'password'),
    createdAt: options?.createdAt ?? new Date(),
    updatedAt: options?.updatedAt ?? new Date(),
    deletedAt: options?.deletedAt,
  });

  const createdUser = await userRepo.create(user);
  return createdUser;
};
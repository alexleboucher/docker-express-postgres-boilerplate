import { CORE_DI_TYPES, REPOSITORIES_DI_TYPES, SERVICES_DI_TYPES } from '@/container/di-types';
import type { TestEnvironment } from './test-environment';
import type { IUserRepository } from '@/domain/repositories';
import { User } from '@/domain/models';
import type { IIDGenerator } from '@/core/id';
import type { IEncryptor } from '@/domain/services/security';

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
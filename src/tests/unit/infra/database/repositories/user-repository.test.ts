import { mock } from 'jest-mock-extended';

import { createMockDrizzleDatabase } from '@/tests/helpers/test-helpers';
import type { IEncryptor } from '@/domain/services/security/encryptor.interface';
import { UserRepository } from '@/infra/database/repositories/user-repository';
import type { UserEntity } from '@/infra/database/schemas/user';
import { User } from '@/domain/models/user';

describe('UserRepository', () => {
  const mockDependencies = () => ({
    encryptor: mock<IEncryptor>(),
    ...createMockDrizzleDatabase(['userTable', 'postTable'] as const),
  });

  describe('findOneById', () => {
    test('Return null if user is not found', async () => {
      const userId = 'id';

      const { database, encryptor, tables } = mockDependencies();

      tables.userTable.findFirst.mockResolvedValue(undefined);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneById(userId);

      expect(user).toBeNull();
    });

    test('Return user if found', async () => {
      const userId = 'id';
      const { database, encryptor, tables } = mockDependencies();

      const now = new Date();

      const userData = {
        id: userId,
        username: 'username',
        email: 'email',
        hashPassword: 'hashPassword',
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      } as UserEntity;
      tables.userTable.findFirst.mockResolvedValue(userData);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneById(userId);

      expect(user).toStrictEqual(new User(userData));
    });
  });

  describe('findOneByEmailPassword', () => {
    test('Return null if user is not found', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, tables } = mockDependencies();

      tables.userTable.findFirst.mockResolvedValue(undefined);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneByEmailPassword(userEmail, 'password');

      expect(user).toBeNull();
    });

    test('Return null if password is invalid', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, tables } = mockDependencies();

      tables.userTable.findFirst.mockResolvedValue({
        id: 'id',
        username: 'username',
        email: userEmail,
        hashPassword: 'hashPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserEntity);

      encryptor.comparePassword.mockResolvedValue(false);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneByEmailPassword(userEmail, 'password');

      expect(user).toBeNull();
    });

    test('Return user if found and password is valid', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, tables } = mockDependencies();

      const userData = {
        id: 'id',
        username: 'username',
        email: userEmail,
        hashPassword: 'hashPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserEntity;

      tables.userTable.findFirst.mockResolvedValue(userData);

      encryptor.comparePassword.mockResolvedValue(true);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneByEmailPassword(userEmail, 'password');

      expect(user).toStrictEqual(new User(userData));
    });
  });

  describe('existsByEmail', () => {
    test('Return true if user exists', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, tables } = mockDependencies();

      tables.userTable.findFirst.mockResolvedValue({
        id: 'id',
        username: 'username',
        email: userEmail,
        hashPassword: 'hashPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserEntity);

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByEmail(userEmail);

      expect(exists).toBe(true);
    });

    test("Return false if user doesn't exist", async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, tables } = mockDependencies();

      tables.userTable.findFirst.mockResolvedValue(undefined);

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByEmail(userEmail);

      expect(exists).toBe(false);
    });
  });

  describe('existsByUsername', () => {
    test('Return true if user exists', async () => {
      const userUsername = 'username';
      const { database, encryptor, tables } = mockDependencies();

      tables.userTable.findFirst.mockResolvedValue({
        id: 'id',
        username: userUsername,
        email: 'email@email.com',
        hashPassword: 'hashPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByUsername(userUsername);

      expect(exists).toBe(true);
    });

    test("Return false if user doesn't exist", async () => {
      const userUsername = 'username';
      const { database, encryptor, tables } = mockDependencies();

      tables.userTable.findFirst.mockResolvedValue(undefined);

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByUsername(userUsername);

      expect(exists).toBe(false);
    });
  });

  describe('create', () => {
    test('Create user and return it', async () => {
      const user = new User({
        id: 'id',
        username: 'username',
        email: 'email@email.com',
        hashPassword: 'hashPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const { database, encryptor, txInsert, txValues, txReturning } = mockDependencies();

      // Mock the transaction to return the user data
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        hashPassword: user.hashPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      } as UserEntity;

      txReturning.mockResolvedValue([userData]);

      const userRepository = new UserRepository(database, encryptor);
      const createdUser = await userRepository.create(user);

      expect(txInsert).toHaveBeenCalled();
      expect(txValues).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        username: user.username,
        hashPassword: user.hashPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      });
      expect(createdUser).toStrictEqual(user);
    });
  });
});
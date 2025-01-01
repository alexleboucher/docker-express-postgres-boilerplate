import { mock } from 'jest-mock-extended';
import type { Repository } from 'typeorm';

import type { IEncryptor } from '@/domain/services/security';
import type { UserEntity, IDatabase } from '@/infra/database';
import { UserRepository } from '@/infra/database';
import { User } from '@/domain/models';
import { mockTypeOrmQueryRunner } from '@/tests/helpers/test-helpers';

describe('UserRepository', () => {
  const mockDependencies = () => ({
    database: mock<IDatabase>(),
    encryptor: mock<IEncryptor>(),
    databaseUserRepository: mock<Repository<UserEntity>>(),
  });

  describe('findOneById', () => {
    test('Return null if user is not found', async () => {
      const userId = 'id';

      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.findOne
        .calledWith(expect.objectContaining({ id: userId }))
        .mockResolvedValue(null);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneById(userId);

      expect(user).toBeNull();
    });

    test('Return user if found', async () => {
      const userId = 'id';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.findOneBy
        .calledWith(expect.objectContaining({ id: userId }))
        .mockResolvedValue({
          id: userId,
          username: 'username',
          email: 'email',
          hashPassword: 'hashPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as UserEntity);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneById(userId);

      expect(user).not.toBeNull();
    });
  });

  describe('findOneByEmailPassword', () => {
    test('Return null if user is not found', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.findOne
        .calledWith(expect.objectContaining({ where: { email: userEmail } }))
        .mockResolvedValue(null);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneByEmailPassword(userEmail, 'password');

      expect(user).toBeNull();
    });

    test('Return null if password is invalid', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.findOne
        .calledWith(expect.objectContaining({ where: { email: userEmail } }))
        .mockResolvedValue({} as UserEntity);

      encryptor.comparePassword.mockResolvedValue(false);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneByEmailPassword(userEmail, 'password');

      expect(user).toBeNull();
    });

    test('Return user if found and password is valid', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.findOne
        .calledWith(expect.objectContaining({ where: { email: userEmail } }))
        .mockResolvedValue({
          id: 'id',
          username: 'username',
          email: userEmail,
          hashPassword: 'hashPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as UserEntity);

      encryptor.comparePassword.mockResolvedValue(true);

      const userRepository = new UserRepository(database, encryptor);
      const user = await userRepository.findOneByEmailPassword(userEmail, 'password');

      expect(user).not.toBeNull();
    });
  });

  describe('existsByEmail', () => {
    test('Return true if user exists', async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.existsBy
        .calledWith(expect.objectContaining({ email: userEmail }))
        .mockResolvedValue(true);

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByEmail(userEmail);

      expect(exists).toBe(true);
    });

    test("Return false if user doesn't exist", async () => {
      const userEmail = 'email@test.com';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.existsBy
        .calledWith(expect.objectContaining({ email: userEmail }))
        .mockResolvedValue(false);

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByEmail(userEmail);

      expect(exists).toBe(false);
    });
  });

  describe('existsByUsername', () => {
    test('Return true if user exists', async () => {
      const userUsername = 'username';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.existsBy
        .calledWith(expect.objectContaining({ username: userUsername }))
        .mockResolvedValue(true);

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByUsername(userUsername);

      expect(exists).toBe(true);
    });

    test("Return false if user doesn't exist", async () => {
      const userUsername = 'username';
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      database.getRepository.mockReturnValue(databaseUserRepository);
      databaseUserRepository.existsBy
        .calledWith(expect.objectContaining({ username: userUsername }))
        .mockResolvedValue(false);

      const userRepository = new UserRepository(database, encryptor);
      const exists = await userRepository.existsByUsername(userUsername);

      expect(exists).toBe(false);
    });
  });

  describe('create', () => {
    const mockDependenciesWithQueryRunner = () => {
      const { database, encryptor, databaseUserRepository } = mockDependencies();

      const queryRunner = mockTypeOrmQueryRunner();
      queryRunner.manager.getRepository = jest.fn().mockReturnValue(databaseUserRepository);
      database.createQueryRunner.mockReturnValue(queryRunner);

      return { database, encryptor, databaseUserRepository };
    };

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

      const { database, encryptor, databaseUserRepository } = mockDependenciesWithQueryRunner();

      databaseUserRepository.existsBy
        .calledWith(expect.objectContaining({ email: user.email }))
        .mockResolvedValue(false);

      databaseUserRepository.existsBy
        .calledWith(expect.objectContaining({ username: user.username }))
        .mockResolvedValue(false);

      databaseUserRepository.save
        .calledWith(expect.objectContaining({ email: user.email }))
        .mockResolvedValue({
          id: user.id,
          username: user.username,
          email: user.email,
          hashPassword: user.hashPassword,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: null,
        });

      const userRepository = new UserRepository(database, encryptor);
      const createdUser = await userRepository.create(user);

      expect(createdUser).toStrictEqual(user);
    });
  });
});
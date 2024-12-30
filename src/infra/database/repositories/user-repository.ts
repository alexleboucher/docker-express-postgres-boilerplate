import { inject, injectable } from 'inversify';

import { User } from '@/domain/models';
import type { IUserRepository } from '@/domain/repositories';
import type { IEncryptor } from '@/domain/services/security';
import { UserEntity } from '@/infra/database/models';
import type { IDatabase } from '@/infra/database';
import { SERVICES_DI_TYPES } from '@/container/di-types';
import { HttpError } from '@/app/http-error';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(SERVICES_DI_TYPES.Database) private readonly database: IDatabase,
    @inject(SERVICES_DI_TYPES.Encryptor) private readonly encryptor: IEncryptor,
  ) {}

  async findOneByEmailPassword(email: string, password: string): Promise<User | null> {
    const user = await this.database.getRepository(UserEntity).findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.encryptor.comparePassword(password, user.hashPassword);
    if (!isPasswordValid) {
      return null;
    }

    return this.toUser(user);
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.database.getRepository(UserEntity).findOneBy({ id });

    if (!user) {
      return null;
    }

    return this.toUser(user);
  }

  async create(user: User): Promise<User> {
    const queryRunner = this.database.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepository = queryRunner.manager.getRepository(UserEntity);

      const emailExists = await userRepository.existsBy({ email: user.email });
      if (emailExists) {
        throw HttpError.conflict('Email already exists');
      }

      const usernameExists = await userRepository.existsBy({ username: user.username });
      if (usernameExists) {
        throw HttpError.conflict('Username already exists');
      }

      const userEntity = this.toEntity(user);

      await userRepository.save(userEntity);
      await queryRunner.commitTransaction();

      return this.toUser(userEntity);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private toUser(user: UserEntity): User {
    return new User({
      id: user.id,
      username: user.username,
      email: user.email,
      hashPassword: user.hashPassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }

  private toEntity(user: User): UserEntity {
    const userEntity = new UserEntity();

    userEntity.id = user.id;
    userEntity.username = user.username;
    userEntity.email = user.email;
    userEntity.hashPassword = user.hashPassword;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.deletedAt = user.deletedAt ?? null;

    return userEntity;
  }
}
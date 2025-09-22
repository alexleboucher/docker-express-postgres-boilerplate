import { inject, injectable } from 'inversify';

import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import { User } from '@/domain/models/user';
import type { IUserRepository } from '@/domain/repositories/user-repository.interface';
import type { IEncryptor } from '@/domain/services/security/encryptor.interface';
import type { IDatabase } from '@/infra/database/database';
import { userTable, type UserEntity } from '@/infra/database/schemas/user';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(SERVICES_DI_TYPES.Database) private readonly database: IDatabase,
    @inject(SERVICES_DI_TYPES.Encryptor) private readonly encryptor: IEncryptor,
  ) {}

  async findOneByEmailPassword(email: string, password: string): Promise<User | null> {
    const user = await this.database.getInstance().query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
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
    const user = await this.database.getInstance().query.userTable.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (!user) {
      return null;
    }

    return this.toUser(user);
  }

  async create(userData: User): Promise<User> {
    const db = this.database.getInstance();

    const newUser = await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(userTable).values({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        hashPassword: userData.hashPassword,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        deletedAt: userData.deletedAt,
      }).returning();

      return newUser;
    });

    return this.toUser(newUser);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const db = this.database.getInstance();
    const result = await db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    return !!result;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const db = this.database.getInstance();
    const result = await db.query.userTable.findFirst({
      where: (user, { eq }) => eq(user.username, username),
    });

    return !!result;
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
}
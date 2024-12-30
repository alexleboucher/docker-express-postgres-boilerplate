import type { User } from '@/domain/models';

export interface IUserRepository {
  findOneByEmailPassword(login: string, password: string): Promise<User | null>;
  findOneById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
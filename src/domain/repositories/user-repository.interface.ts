import type { User } from '@/domain/models/user';

export interface IUserRepository {
  findOneByEmailPassword(login: string, password: string): Promise<User | null>;
  findOneById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
}
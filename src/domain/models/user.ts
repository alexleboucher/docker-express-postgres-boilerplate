import type { Id } from '@/core/id/id';

export type UserId = Id<'User'>;

export class User {
  id: UserId;
  username: string;
  email: string;
  hashPassword: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(params: {
    id: string;
    username: string;
    email: string;
    hashPassword: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }) {
    this.id = params.id as UserId;
    this.username = params.username;
    this.email = params.email;
    this.hashPassword = params.hashPassword;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}
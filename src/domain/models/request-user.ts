import type { User, UserId } from '@/domain/models/user';

/**
 * This class is used to represent a user in the request context.
 */
export class RequestUser {
  id: UserId;
  username: string;
  email: string;
  constructor(params: {
    id: string;
    username: string;
    email: string;
  }) {
    this.id = params.id as UserId;
    this.username = params.username;
    this.email = params.email;
  }

  static fromUser(user: User): RequestUser {
    return new RequestUser({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }
}
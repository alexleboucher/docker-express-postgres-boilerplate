import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import type { IUserRepository } from '@/domain/repositories/user-repository.interface';
import type { IAuthenticator, AuthenticateResponse, GetAuthenticatedUserResponse } from '@/domain/services/auth/authenticator.interface';

type JwtPayload = {
  id: string;
};

@injectable()
export class JwtAuthenticator implements IAuthenticator {
  constructor(
    private readonly config: {
      secret: string;
      expiresInSeconds: number;
    },
    @inject(REPOSITORIES_DI_TYPES.UserRepository) private readonly userRepository: IUserRepository,
  ) {}

  async authenticate(email: string, password: string): Promise<AuthenticateResponse> {
    const user = await this.userRepository.findOneByEmailPassword(email, password);
    if (!user) {
      return { success: false };
    }

    const token = jwt.sign({ id: user.id }, this.config.secret, {
      expiresIn: this.config.expiresInSeconds,
    });

    return { success: true, user, token };
  }

  async getAuthenticatedUser(token: string): Promise<GetAuthenticatedUserResponse> {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, this.config.secret) as JwtPayload;
    } catch {
      return {
        success: false,
        reason: 'InvalidToken',
      };
    }

    const user = await this.userRepository.findOneById(decoded.id);
    if (!user) {
      return {
        success: false,
        reason: 'UserNotFound',
      };
    }

    return {
      success: true,
      user,
    };
  }
}
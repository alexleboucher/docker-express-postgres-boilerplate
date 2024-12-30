import { inject, injectable } from 'inversify';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import type { NextFunction, Request, Response } from 'express';

import type { IUserRepository } from '@/domain/repositories';
import type { IAuthenticator, AuthenticateResponse } from '@/domain/services/auth';
import { RequestUser, type User } from '@/domain/models';
import { REPOSITORIES_DI_TYPES } from '@/container/di-types';

@injectable()
export class PassportAuthenticator implements IAuthenticator {
  constructor(
    @inject(REPOSITORIES_DI_TYPES.UserRepository) private readonly userRepository: IUserRepository,
  ) {}

  configure() {
    passport.use(this.getLocalStrategy());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.serializeUser<string>((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser<string, Request>(async (req, id, done: (err: unknown, user: RequestUser | null) => void) => {
      const user = await this.userRepository.findOneById(id);

      if (!user) {
        // if passport tries to deserialize user but id doesn't exist anymore in db,
        // it means the user has been deleted, so logout the request
        req.logout(() => undefined);
        done(null, null);
      } else {
        done(null, RequestUser.fromUser(user));
      }
    });
  }

  session() {
    return passport.session();
  }

  isAuthenticated(req: Request): boolean {
    return req.isAuthenticated();
  }

  authenticateLocal(req: Request, res: Response, next: NextFunction): Promise<AuthenticateResponse> {
    return new Promise((resolve) => {
      passport.authenticate('local', (err?: unknown, user?: User | false | null) => {
        if (err) {
          return resolve({ err });
        }

        if (!user) {
          return resolve({ user });
        }

        req.logIn(user, (loginErr) => {
          if (loginErr) {
            return resolve({ err: loginErr });
          }
          return resolve({ user });
        });

        return undefined;
      })(req, res, next);
    });
  }

  async logout(req: Request): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      req.logout((err) => {
        if (err) {
          return reject(err);
        }
        req.session.destroy(() => resolve());
        return undefined;
      });
    });
  }

  private getLocalStrategy() {
    return new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done: (err: unknown, user?: User) => void) => {
        try {
          // Search a user whose username or email is the login parameter
          const user = await this.userRepository.findOneByEmailPassword(email, password);

          // If the user doesn't exist or the password is wrong, return error as null and user as undefined
          // It allows to distinguish technical error and wrong credentials
          if (!user) {
            return done(null, undefined);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    );
  }
}
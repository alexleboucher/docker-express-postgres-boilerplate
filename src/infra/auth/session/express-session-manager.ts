import pgSession from 'connect-pg-simple';
import session, { type CookieOptions, type SessionOptions } from 'express-session';
import { injectable } from 'inversify';

import type { ISessionManager } from '@/domain/services/auth/session-manager.interface';

type SessionStoreConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type SessionConfig = {
  storeConfig?: SessionStoreConfig;
  secret: SessionOptions['secret'];
  resave: SessionOptions['resave'];
  saveUninitialized: SessionOptions['saveUninitialized'];
  cookie: {
    secure: CookieOptions['secure'];
    maxAge: CookieOptions['maxAge'];
    httpOnly: CookieOptions['httpOnly'];
    sameSite: 'strict' | 'lax' | 'none';
  };
};

@injectable()
export class ExpressSessionManager implements ISessionManager {
  constructor(private readonly config: SessionConfig) {}

  configure() {
    let sessionStore: pgSession.PGStore | undefined;
    if (this.config.storeConfig) {
      const postgresSession = pgSession(session);
      sessionStore = new postgresSession({
        conObject: this.config.storeConfig,
        createTableIfMissing: true,
      });
    }

    return session({
      store: sessionStore,
      secret: this.config.secret,
      resave: this.config.resave,
      saveUninitialized: this.config.saveUninitialized,
      cookie: {
        secure: this.config.cookie.secure,
        maxAge: this.config.cookie.maxAge,
        httpOnly: this.config.cookie.httpOnly,
        sameSite: this.config.cookie.sameSite,
      },
    });
  }
}
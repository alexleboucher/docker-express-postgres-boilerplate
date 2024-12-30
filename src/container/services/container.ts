import type { BuildContainerOptions, ContainerBuilder } from '@/container';
import { SERVICES_DI_TYPES } from '@/container/di-types';
import { booleanEnv, env, integerEnv, mandatoryEnv, mandatoryIntegerEnv, unionEnv } from '@/core/env';
import type { IAuthenticator, ISessionManager } from '@/domain/services/auth';
import type { IEncryptor } from '@/domain/services/security';
import { PassportAuthenticator } from '@/infra/auth/authenticator';
import type { SessionConfig } from '@/infra/auth/session';
import { ExpressSessionManager } from '@/infra/auth/session';
import type { DatabaseConfig, IDatabase } from '@/infra/database';
import { Database } from '@/infra/database';
import { BcryptEncryptor } from '@/infra/security/encryptor';

export const registerServices = (containerBuilder: ContainerBuilder, options?: BuildContainerOptions) => {
  let builder;

  if (options?.onlyDatabase) {
    builder = new ServicesContainerBuilder(containerBuilder).registerOnlyDatabase();
  } else {
    builder = new ServicesContainerBuilder(containerBuilder).registerServices();
  }

  return builder;
};

/**
 * This class is used to register all the use cases in the container
 */
class ServicesContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerServices() {
    this
      .registerAuthServices()
      .registerSecurityServices()
      .registerDatabaseService();

    return this.containerBuilder;
  }

  registerOnlyDatabase() {
    this.registerDatabaseService();

    return this.containerBuilder;
  }

  private registerAuthServices() {
    const config = this.getSessionManagerConfig();
    this.containerBuilder.registerActions.push((container) => {
      container.bind<ISessionManager>(SERVICES_DI_TYPES.SessionManager).toDynamicValue(() => new ExpressSessionManager(config)).inSingletonScope();
    });

    this.containerBuilder.registerActions.push((container) => {
      container.bind<IAuthenticator>(SERVICES_DI_TYPES.Authenticator).to(PassportAuthenticator).inSingletonScope();
    });

    return this;
  }

  private registerSecurityServices() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IEncryptor>(SERVICES_DI_TYPES.Encryptor).toDynamicValue(() => new BcryptEncryptor({
        saltRounds: integerEnv('PASSWORD_ENCRYPTION_SALT_ROUNDS', 10),
      })).inSingletonScope();
    });

    return this;
  }

  private registerDatabaseService() {
    const config = this.getDatabaseConfig();
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IDatabase>(SERVICES_DI_TYPES.Database).toDynamicValue(() => new Database(config)).inSingletonScope();
    });

    return this;
  }

  private getSessionManagerConfig(): SessionConfig {
    const nodeEnv = mandatoryEnv('NODE_ENV');

    return {
      storeConfig: nodeEnv === 'test' ? undefined : {
        host: mandatoryEnv('DB_HOST'),
        port: mandatoryIntegerEnv('DB_PORT'),
        user: mandatoryEnv('DB_USER'),
        password: mandatoryEnv('DB_PASSWORD'),
        database: mandatoryEnv('DB_NAME'),
      },
      secret: env('SESSION_SECRET', 'pet-signal-session-secret'),
      resave: booleanEnv('SESSION_RESAVE', false),
      saveUninitialized: booleanEnv('SESSION_SAVE_UNINITIALIZED', false),
      cookie: {
        secure: booleanEnv('SESSION_COOKIE_SECURE', false),
        maxAge: integerEnv('SESSION_COOKIE_MAX_AGE', 90 * 24 * 60 * 60 * 1000), // 90 days by default
        httpOnly: booleanEnv('SESSION_COOKIE_HTTP_ONLY', false),
        sameSite: unionEnv<SessionConfig['cookie']['sameSite']>('SESSION_COOKIE_SAME_SITE', ['strict', 'lax', 'none',], 'lax'),
      },
    };
  }

  private getDatabaseConfig(): DatabaseConfig {
    const isTest = mandatoryEnv('NODE_ENV') === 'test';

    return {
      type: 'postgres',
      host: isTest ? mandatoryEnv('TEST_DB_HOST') : mandatoryEnv('DB_HOST'),
      port: isTest ? mandatoryIntegerEnv('TEST_DB_PORT') : mandatoryIntegerEnv('DB_PORT'),
      username: mandatoryEnv('DB_USER'),
      password: mandatoryEnv('DB_PASSWORD'),
      database: isTest ? mandatoryEnv('TEST_DB_NAME') : mandatoryEnv('DB_NAME'),
      logging: booleanEnv('DB_LOGGING', false),
      migrationsRun: isTest,
      entities: [env('TYPEORM_ENTITIES', 'src/infra/database/models/**/*.entity.ts')],
      migrations: [env('TYPEORM_MIGRATIONS', 'src/infra/database/migrations/**/*.ts')],
    };
  }
}
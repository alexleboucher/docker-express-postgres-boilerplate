import type { BuildContainerOptions, ContainerBuilder } from '@/container/container';
import { REPOSITORIES_DI_TYPES } from '@/container/repositories/di-types';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import { integerEnv, mandatoryEnv, mandatoryIntegerEnv, booleanEnv, env } from '@/core/env/env';
import type { IUserRepository } from '@/domain/repositories/user-repository.interface';
import type { IAuthenticator } from '@/domain/services/auth/authenticator.interface';
import type { IEncryptor } from '@/domain/services/security/encryptor.interface';
import { JwtAuthenticator } from '@/infra/auth/authenticator/jwt-authenticator';
import type { IDatabase, DatabaseConfig } from '@/infra/database/database';
import { Database } from '@/infra/database/database';
import { BcryptEncryptor } from '@/infra/security/encryptor/bcrypt-encryptor';


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
 * This class is used to register all the services in the container
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
    const config = {
      secret: mandatoryEnv('JWT_SECRET'),
      expiresInSeconds: integerEnv('JWT_EXPIRES_IN_SECONDS', 86400), // 1 day in seconds (default)
    };
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IAuthenticator>(SERVICES_DI_TYPES.Authenticator).toDynamicValue(() => new JwtAuthenticator(
        config,
        container.get<IUserRepository>(REPOSITORIES_DI_TYPES.UserRepository),
      )).inSingletonScope();
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
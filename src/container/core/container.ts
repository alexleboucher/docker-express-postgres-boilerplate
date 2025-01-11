import type { ContainerBuilder } from '@/container/container';
import { CORE_DI_TYPES } from '@/container/core/di-types';
import { unionEnv } from '@/core/env/env';
import type { IIDGenerator } from '@/core/id/id-generator.interface';
import type { ILogger } from '@/core/logger/logger.interface';
import type { ITime } from '@/core/time/time.interface';
import { UUIDGenerator } from '@/infra/id-generator/uuid-generator';
import { BrokenLogger } from '@/infra/logger/broken-logger';
import { ConsoleLogger } from '@/infra/logger/console-logger';
import { SystemTime } from '@/infra/time/system-time';

export const registerCore = (containerBuilder: ContainerBuilder) => {
  const builder = new CoreContainerBuilder(containerBuilder)
    .registerCore();

  return builder;
};

/**
 * This class is used to register all the repositories in the container
 */
class CoreContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerCore() {
    this
      .registerLogger()
      .registerIdGenerator()
      .registerTime();

    return this.containerBuilder;
  }

  private registerLogger() {
    const loggerType = unionEnv('LOGGER_TYPE', ['console', 'broken'], 'console');
    const logger = loggerType === 'console' ? ConsoleLogger : BrokenLogger;
    this.containerBuilder.registerActions.push((container) => {
      container.bind<ILogger>(CORE_DI_TYPES.Logger).to(logger).inSingletonScope();
    });

    return this;
  }

  private registerIdGenerator() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IIDGenerator>(CORE_DI_TYPES.IDGenerator).to(UUIDGenerator).inSingletonScope();
    });

    return this;
  }

  private registerTime() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<ITime>(CORE_DI_TYPES.Time).to(SystemTime).inSingletonScope();
    });

    return this;
  }
}
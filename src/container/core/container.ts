import type { ContainerBuilder } from '@/container';
import { CORE_DI_TYPES } from '@/container/core/di-types';
import { unionEnv } from '@/core/env';
import type { IIDGenerator } from '@/core/id';
import type { ILogger } from '@/core/logger';
import type { ITime } from '@/core/time';
import { UUIDGenerator } from '@/infra/id-generator';
import { BrokenLogger, ConsoleLogger } from '@/infra/logger';
import { SystemTime } from '@/infra/time';

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
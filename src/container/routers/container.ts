import { ApiRouter } from '@/app/routers/api-router';
import { AuthRouter } from '@/app/routers/auth-router';
import { HealthRouter } from '@/app/routers/health-router';
import type { BaseRouter } from '@/app/routers/base-router';
import { UsersRouter } from '@/app/routers/users-router';
import type { ContainerBuilder } from '@/container/container';
import { ROUTERS_DI_TYPES } from '@/container/routers/di-types';

export const registerRouters = (containerBuilder: ContainerBuilder) => {
  const builder = new RoutersContainerBuilder(containerBuilder)
    .registerRouters();

  return builder;
};

/**
 * This class is used to register all the routers in the container
 */
class RoutersContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerRouters() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<BaseRouter>(ROUTERS_DI_TYPES.ApiRouter).to(ApiRouter).inSingletonScope();
    });
    this.containerBuilder.registerActions.push((container) => {
      container.bind<BaseRouter>(ROUTERS_DI_TYPES.AuthRouter).to(AuthRouter).inSingletonScope();
    });
    this.containerBuilder.registerActions.push((container) => {
      container.bind<BaseRouter>(ROUTERS_DI_TYPES.UsersRouter).to(UsersRouter).inSingletonScope();
    });
    this.containerBuilder.registerActions.push((container) => {
      container.bind<BaseRouter>(ROUTERS_DI_TYPES.HealthRouter).to(HealthRouter).inSingletonScope();
    });

    return this.containerBuilder;
  }
}
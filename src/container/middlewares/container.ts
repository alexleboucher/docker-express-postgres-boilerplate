import type { BaseMiddleware } from 'inversify-express-utils';

import type { ContainerBuilder } from '@/container/container';
import { MIDDLEWARES_DI_TYPES } from '@/container/middlewares/di-types';
import { AuthenticatedMiddleware } from '@/app/middlewares/authenticated-middleware';
import type { IErrorMiddleware } from '@/app/middlewares/error-middleware';
import { ErrorMiddleware } from '@/app/middlewares/error-middleware';
import type { ICurrentUserMiddleware } from '@/app/middlewares/current-user-middleware';
import { CurrentUserMiddleware } from '@/app/middlewares/current-user-middleware';

export const registerMiddlewares = (containerBuilder: ContainerBuilder) => {
  const builder = new MiddlewaresContainerBuilder(containerBuilder)
    .registerMiddlewares();

  return builder;
};

/**
 * This class is used to register all the middlewares in the container
 */
class MiddlewaresContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerMiddlewares() {
    this
      .registerCurrentUserMiddleware()
      .registerAuthenticatedMiddleware()
      .registerErrorMiddleware();

    return this.containerBuilder;
  }

  private registerCurrentUserMiddleware() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<ICurrentUserMiddleware>(MIDDLEWARES_DI_TYPES.CurrentUserMiddleware).to(CurrentUserMiddleware).inRequestScope();
    });

    return this;
  }

  private registerAuthenticatedMiddleware() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<BaseMiddleware>(MIDDLEWARES_DI_TYPES.AuthenticatedMiddleware).to(AuthenticatedMiddleware).inRequestScope();
    });

    return this;
  }

  private registerErrorMiddleware() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IErrorMiddleware>(MIDDLEWARES_DI_TYPES.ErrorMiddleware).to(ErrorMiddleware).inRequestScope();
    });

    return this;
  }
}
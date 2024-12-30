import type { BaseMiddleware } from 'inversify-express-utils';

import { AuthenticatedMiddleware, ErrorMiddleware, type IErrorMiddleware } from '@/app/middlewares';
import type { ContainerBuilder } from '@/container';
import { MIDDLEWARES_DI_TYPES } from '@/container/di-types';

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
      .registerAuthenticatedMiddleware()
      .registerErrorMiddleware();

    return this.containerBuilder;
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
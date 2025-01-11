import type { BaseMiddleware } from 'inversify-express-utils';

import type { ContainerBuilder } from '@/container/container';
import { MIDDLEWARES_DI_TYPES } from '@/container/middlewares/di-types';
import { AuthenticatedMiddleware } from '@/app/middlewares/authenticated-middleware';
import type { IErrorMiddleware } from '@/app/middlewares/error-middleware';
import { ErrorMiddleware } from '@/app/middlewares/error-middleware';

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
import { LoginRequestHandler } from '@/app/request-handlers/auth/commands/login-request-handler';
import { AuthenticatedRequestHandler } from '@/app/request-handlers/auth/queries/authenticated-request-handler';
import { HealthRequestHandler } from '@/app/request-handlers/health/queries/health-request-handler';
import type { IRequestHandler } from '@/app/request-handlers/request-handler.interface';
import { CreateUserRequestHandler } from '@/app/request-handlers/users/commands/create-user-request-handler';
import type { ContainerBuilder } from '@/container/container';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/request-handlers/di-types';

export const registerRequestHandlers = (containerBuilder: ContainerBuilder) => {
  const builder = new RequestHandlersContainerBuilder(containerBuilder)
    .registerRequestHandlers();

  return builder;
};

/**
 * This class is used to register all the request handlers in the container
 */
class RequestHandlersContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerRequestHandlers() {
    this
      .registerAuthRequestHandlers()
      .registerUsersRequestHandlers()
      .registerHealthRequestHandlers();

    return this.containerBuilder;
  }

  private registerAuthRequestHandlers() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.LoginRequestHandler).to(LoginRequestHandler).inSingletonScope();
    });
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.AuthenticatedRequestHandler).to(AuthenticatedRequestHandler).inSingletonScope();
    });

    return this;
  }

  private registerUsersRequestHandlers() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.CreateUserRequestHandler).to(CreateUserRequestHandler).inSingletonScope();
    });

    return this;
  }

  private registerHealthRequestHandlers() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.HealthRequestHandler).to(HealthRequestHandler).inSingletonScope();
    });

    return this;
  }
}
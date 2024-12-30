import type { IRequestHandler } from '@/app/request-handlers';
import { AuthenticatedRequestHandler, LoginRequestHandler, LogoutRequestHandler } from '@/app/request-handlers/auth';
import { HealthRequestHandler } from '@/app/request-handlers/health';
import { CreateUserRequestHandler } from '@/app/request-handlers/users';
import type { ContainerBuilder } from '@/container';
import { REQUEST_HANDLERS_DI_TYPES } from '@/container/di-types';

export const registerRequestHandlers = (containerBuilder: ContainerBuilder) => {
  const builder = new RequestHandlersContainerBuilder(containerBuilder)
    .registerRequestHandlers();

  return builder;
};

/**
 * This class is used to register all the use cases in the container
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
      container.bind<IRequestHandler>(REQUEST_HANDLERS_DI_TYPES.LogoutRequestHandler).to(LogoutRequestHandler).inSingletonScope();
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
import { Container } from 'inversify';

import '@/app/controllers';
import { registerMiddlewares } from '@/container/middlewares';
import { registerRepositories } from '@/container/repositories';
import { registerUseCases } from '@/container/use-cases';
import { registerRequestHandlers } from '@/container/request-handlers';
import { registerServices } from '@/container/services';
import { registerCore } from '@/container/core';

type ContainerRegisterAction = (container: Container) => void | Promise<void>;

export type BuildContainerOptions = {
  onlyDatabase?: boolean;
};

export const setupContainer = (options?: BuildContainerOptions) => {
  let builder;

  if (options?.onlyDatabase) {
    builder = new ContainerBuilder().registerOnlyDatabase();
  } else {
    builder = new ContainerBuilder().register();
  }

  return builder.build();
};

export class ContainerBuilder {
  public readonly registerActions: ContainerRegisterAction[] = [];

  async build(): Promise<Container> {
    const container = new Container();

    for (const register of this.registerActions) {
      await register(container);
    }

    return container;
  }

  register(): ContainerBuilder {
    this
      .registerCore()
      .registerServices()
      .registerRepositories()
      .registerMiddlewares()
      .registerUseCases()
      .registerRequestHandlers();

    return this;
  }

  registerOnlyDatabase() {
    this.registerServices({ onlyDatabase: true });
    return this;
  }

  private registerCore() {
    return registerCore(this);
  }

  private registerServices(options?: BuildContainerOptions) {
    return registerServices(this, options);
  }

  private registerRepositories() {
    return registerRepositories(this);
  }

  private registerMiddlewares() {
    return registerMiddlewares(this);
  }

  private registerUseCases() {
    return registerUseCases(this);
  }

  private registerRequestHandlers() {
    return registerRequestHandlers(this);
  }
}
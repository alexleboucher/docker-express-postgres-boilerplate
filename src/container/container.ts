import { Container } from 'inversify';

import { registerCore } from '@/container/core/container';
import { registerServices } from '@/container/services/container';
import { registerRepositories } from '@/container/repositories/container';
import { registerMiddlewares } from '@/container/middlewares/container';
import { registerUseCases } from '@/container/use-cases/container';
import { registerRequestHandlers } from '@/container/request-handlers/container';

import { registerRouters } from '@/container/routers/container';

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
      .registerMiddlewares()
      .registerRouters()
      .registerRequestHandlers()
      .registerUseCases()
      .registerServices()
      .registerRepositories();

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

  private registerRouters() {
    return registerRouters(this);
  }
}
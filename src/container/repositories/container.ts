import type { ContainerBuilder } from '@/container';
import { REPOSITORIES_DI_TYPES } from '@/container/di-types';
import type { IUserRepository } from '@/domain/repositories';
import { UserRepository } from '@/infra/database/repositories/user-repository';

export const registerRepositories = (containerBuilder: ContainerBuilder) => {
  const builder = new RepositoriesContainerBuilder(containerBuilder)
    .registerRepositories();

  return builder;
};

/**
 * This class is used to register all the repositories in the container
 */
class RepositoriesContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerRepositories() {
    this.registerUserRepository();

    return this.containerBuilder;
  }

  private registerUserRepository() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IUserRepository>(REPOSITORIES_DI_TYPES.UserRepository).to(UserRepository).inSingletonScope();
    });

    return this;
  }
}
import type { ContainerBuilder } from '@/container/container';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import { CreateUserUseCase } from '@/domain/use-cases/user/create-user-use-case';

export const registerUseCases = (containerBuilder: ContainerBuilder) => {
  const builder = new UseCasesContainerBuilder(containerBuilder)
    .registerUseCases();

  return builder;
};

/**
 * This class is used to register all the use cases in the container
 */
class UseCasesContainerBuilder {
  constructor(private readonly containerBuilder: ContainerBuilder) {}

  registerUseCases() {
    this.registerCreateUserUseCase();

    return this.containerBuilder;
  }

  private registerCreateUserUseCase() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IUseCase>(USE_CASES_DI_TYPES.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();
    });

    return this;
  }
}
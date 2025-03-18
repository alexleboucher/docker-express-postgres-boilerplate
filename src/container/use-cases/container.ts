import type { ContainerBuilder } from '@/container/container';
import { USE_CASES_DI_TYPES } from '@/container/use-cases/di-types';
import type { IUseCase } from '@/core/use-case/use-case.interface';
import { GetCurrentUserUseCase } from '@/domain/use-cases/auth/get-current-user-use-case';
import { LoginUseCase } from '@/domain/use-cases/auth/login-use-case';
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
    this
      .registerAuthUseCases()
      .registerUserUseCases();

    return this.containerBuilder;
  }

  private registerAuthUseCases() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IUseCase>(USE_CASES_DI_TYPES.LoginUseCase).to(LoginUseCase).inSingletonScope();
    });

    this.containerBuilder.registerActions.push((container) => {
      container.bind<IUseCase>(USE_CASES_DI_TYPES.GetCurrentUserUseCase).to(GetCurrentUserUseCase).inSingletonScope();
    });

    return this;
  }

  private registerUserUseCases() {
    this.containerBuilder.registerActions.push((container) => {
      container.bind<IUseCase>(USE_CASES_DI_TYPES.CreateUserUseCase).to(CreateUserUseCase).inSingletonScope();
    });

    return this;
  }
}
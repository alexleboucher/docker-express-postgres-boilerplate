import { mock } from 'jest-mock-extended';

import { Failure, Success } from '@/core/result/result';
import type { IIDGenerator } from '@/core/id/id-generator.interface';
import type { ITime } from '@/core/time/time.interface';
import { User } from '@/domain/models/user';
import type { IUserRepository } from '@/domain/repositories/user-repository.interface';
import type { IEncryptor } from '@/domain/services/security/encryptor.interface';
import type { CreateUserUseCasePayload } from '@/domain/use-cases/user/create-user-use-case';
import { CreateUserUseCase } from '@/domain/use-cases/user/create-user-use-case';

describe('CreateUserUseCase', () => {
  test('Call encryptor, call repository and send success reponse', async () => {
    const idGenerator = mock<IIDGenerator>();
    const time = mock<ITime>();
    const encryptor = mock<IEncryptor>();
    const userRepository = mock<IUserRepository>();

    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(false);
    idGenerator.generate.mockReturnValue('test_id');
    time.now.mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));
    encryptor.hashPassword.mockResolvedValue('test_hash_password');

    const user = new User({
      id: 'test_id',
      email: 'test@test.com',
      username: 'test_username',
      hashPassword: 'test_hash_password',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    });
    userRepository.create.mockResolvedValue(user);

    const useCase = new CreateUserUseCase(idGenerator, time, encryptor, userRepository);

    const payload: CreateUserUseCasePayload = {
      email: 'test@test.com',
      username: 'test_username',
      password: 'test_password',
    };

    const result = await useCase.execute(payload);

    expect(encryptor.hashPassword).toHaveBeenCalledWith('test_password');
    expect(userRepository.create).toHaveBeenCalledWith(user);
    expect(result).toStrictEqual(new Success({ user }));
  });

  test('Call repository and send failure response if email already exists', async () => {
    const idGenerator = mock<IIDGenerator>();
    const time = mock<ITime>();
    const encryptor = mock<IEncryptor>();
    const userRepository = mock<IUserRepository>();

    userRepository.existsByEmail.mockResolvedValue(true);

    const useCase = new CreateUserUseCase(idGenerator, time, encryptor, userRepository);

    const payload: CreateUserUseCasePayload = {
      email: 'test@test.com',
      username: 'test_username',
      password: 'test_password',
    };

    const result = await useCase.execute(payload);
    expect(result).toStrictEqual(new Failure({
      reason: 'EmailAlreadyExists',
      error: new Error('Email already exists'),
    }));
  });

  test('Call repository and send failure response if username already exists', async () => {
    const idGenerator = mock<IIDGenerator>();
    const time = mock<ITime>();
    const encryptor = mock<IEncryptor>();
    const userRepository = mock<IUserRepository>();

    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.existsByUsername.mockResolvedValue(true);

    const useCase = new CreateUserUseCase(idGenerator, time, encryptor, userRepository);

    const payload: CreateUserUseCasePayload = {
      email: 'test@test.com',
      username: 'test_username',
      password: 'test_password',
    };

    const result = await useCase.execute(payload);
    expect(result).toStrictEqual(new Failure({
      reason: 'UsernameAlreadyExists',
      error: new Error('Username already exists'),
    }));
  });
});
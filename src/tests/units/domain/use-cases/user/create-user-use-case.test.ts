import { mock } from 'jest-mock-extended';

import type { IIDGenerator } from '@/core/id';
import type { ITime } from '@/core/time';
import type { IUserRepository } from '@/domain/repositories';
import type { IEncryptor } from '@/domain/services/security';
import type { CreateUserCasePayload } from '@/domain/use-cases/user';
import { CreateUserUseCase } from '@/domain/use-cases/user';
import { User } from '@/domain/models';
import { Success } from '@/core/result/result';

describe('CreateUserUseCase', () => {
  test('Call encryptor, call repository and send success reponse', async () => {
    const idGenerator = mock<IIDGenerator>();
    const time = mock<ITime>();
    const encryptor = mock<IEncryptor>();
    const userRepository = mock<IUserRepository>();

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

    const payload: CreateUserCasePayload = {
      email: 'test@test.com',
      username: 'test_username',
      password: 'test_password',
    };

    const result = await useCase.execute(payload);

    expect(encryptor.hashPassword).toHaveBeenCalledWith('test_password');
    expect(userRepository.create).toHaveBeenCalledWith(user);
    expect(result).toStrictEqual(new Success(user));
  });
});
import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import { CreateUserRequestHandler } from '@/app/request-handlers/users';
import type { IUseCase } from '@/core/use-case';
import { Success } from '@/core/result/result';
import { User } from '@/domain/models';

describe('CreateUserRequestHandler', () => {
  test('Call CreateUserUserCase and send success response with user infos', async () => {
    const req = {
      body: {
        username: 'test_username',
        email: 'test@test.com',
        password: 'test1234',
      }
    } as Request;
    const res = mock<Response>();
    res.status.mockReturnThis();
    const createUserUseCase = mock<IUseCase>();

    const createdUser = new User({
      id: '1',
      username: req.body.username,
      email: req.body.email,
      hashPassword: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    createUserUseCase.execute.mockResolvedValue(
      new Success(createdUser),
    );

    const handler = new CreateUserRequestHandler(createUserUseCase);
    await handler.handle(req, res);

    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
    });
  });
});
import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import type { IUseCase } from '@/core/use-case/use-case.interface';
import { User } from '@/domain/models/user';
import { Failure, Success } from '@/core/result/result';
import { HttpError } from '@/app/http-error';
import { CreateUserRequestHandler } from '@/app/request-handlers/users/commands/create-user-request-handler';

describe('CreateUserRequestHandler', () => {
  test('Call CreateUserUseCase and send success response with user infos', async () => {
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
      new Success({ user: createdUser }),
    );

    const handler = new CreateUserRequestHandler(createUserUseCase);
    await handler.handler(req, res);

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

  test('Throw zod error if email is not valid', async () => {
    const req = {
      body: {
        username: 'test_username',
        email: 'test@test',
        password: 'test1234',
      }
    } as Request;
    const res = mock<Response>();
    res.status.mockReturnThis();
    const createUserUseCase = mock<IUseCase>();

    const handler = new CreateUserRequestHandler(createUserUseCase);
    await expect(handler.handler(req, res)).rejects.toThrow(ZodError);
  });

  test('Throw conflict error if email already exists', async () => {
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

    createUserUseCase.execute.mockResolvedValue(
      new Failure({
        reason: 'EmailAlreadyExists',
        error: new Error('Email already exists'),
      }),
    );

    const handler = new CreateUserRequestHandler(createUserUseCase);
    await expect(handler.handler(req, res)).rejects.toStrictEqual(HttpError.conflict('Email already exists'));
  });

  test('Throw conflict error if username already exists', async () => {
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

    createUserUseCase.execute.mockResolvedValue(
      new Failure({
        reason: 'UsernameAlreadyExists',
        error: new Error('Username already exists'),
      }),
    );

    const handler = new CreateUserRequestHandler(createUserUseCase);
    await expect(handler.handler(req, res)).rejects.toStrictEqual(HttpError.conflict('Username already exists'));
  });
});
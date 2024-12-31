import type { QueryRunner } from 'typeorm';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

import { createServer } from '@/app/server';
import { setupContainer } from '@/container/container';
import type { IDatabase, } from '@/infra/database';
import { TestEnvironment } from '@/tests/helpers/test-environment';
import { SERVICES_DI_TYPES } from '@/container/di-types';

type CreateTestServerOptions = {
  port?: number;
  connectDatabase?: boolean;
};
/**
 * Create a test environment.
 * @param options - Options used to create the test server. Optional.
 * @param options.port - Port used to listen server. Default 7777. Optional.
 * @param options.connectDatabase - Connect to the database. Default true. Optional.
 * @returns The created test environment.
 */
export const createTestEnvironment = async (options?: CreateTestServerOptions): Promise<TestEnvironment> => {
  const { port = 7777, connectDatabase = true } = options || {};

  const container = await setupContainer();

  const server = createServer(container);

  if (connectDatabase) {
    const database = container.get<IDatabase>(SERVICES_DI_TYPES.Database);
    await database.initialize();
  }

  return new TestEnvironment(server.build().listen(port), container);
};

/**
 * Mock a TypeORM query runner.
 * @returns The mocked query runner.
 */
export const mockTypeOrmQueryRunner = () => ({
  manager: {},
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
} as unknown as QueryRunner);
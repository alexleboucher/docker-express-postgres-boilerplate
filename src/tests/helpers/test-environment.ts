import type { Container } from 'inversify';
import type { Server } from 'http';
import request from 'supertest';

import type { IDatabase } from '@/infra/database';
import { SERVICES_DI_TYPES } from '@/container/di-types';
import { createTestUser, type CreateTestUserOptions } from './user-helpers';

export class TestEnvironment {
  server: Server;
  container: Container;

  constructor(server: Server, container: Container) {
    this.server = server;
    this.container = container;
  }

  /**
   * Close the test environment server and database connection.
   */
  async close() {
    this.server.close();
    const database = this.container.get<IDatabase>(SERVICES_DI_TYPES.Database);
    await database.destroyIfInitialized();
  }

  /**
   * Clear the database.
   */
  async clearDatabase() {
    const database = this.container.get<IDatabase>(SERVICES_DI_TYPES.Database);
    const dataSource = database.getDataSource();
    const entities = dataSource.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    await dataSource.query(`TRUNCATE ${entities} CASCADE;`);
  }

  /**
   * Create a test agent.
   * @returns The created agent.
   */
  request() {
    return request(this.server);
  }

  /**
   * Create an authenticated test agent. A test agent allows to maintain session between multiple requests.
   * @param testUserOptions - The authenticated user informations. Optional.
   * @returns The created agent.
   */
  async createAuthenticatedAgent(testUserOptions?: CreateTestUserOptions) {
    const userAgent = request.agent(this.server);
    const user = await createTestUser(this, testUserOptions);
    await userAgent
      .post('/auth/login')
      .send({ email: user.email, password: testUserOptions?.password || 'password' });

    return { agent: userAgent, user };
  }
}
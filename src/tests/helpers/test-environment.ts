import type { Container } from 'inversify';
import type { Server } from 'http';
import request from 'supertest';

import type { IDatabase } from '@/infra/database/database';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import type { CreateTestUserOptions } from '@/tests/helpers/user-helpers';
import { createTestUser } from '@/tests/helpers/user-helpers';

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
   * Create a test client.
   * @returns The created client.
   */
  request() {
    return request(this.server);
  }

  async authenticatedRequest(testUserOptions?: CreateTestUserOptions) {
    const user = await createTestUser(this, testUserOptions);
    const agent = request.agent(this.server);
    const res = await agent
      .post('/auth/login')
      .send({ email: user.email, password: testUserOptions?.password || 'password' });

    return agent.set({ Authorization: `Bearer ${res.body.token}` });
  }
}

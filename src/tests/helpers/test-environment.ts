import type { Container } from 'inversify';
import type { Server } from 'http';
import request from 'supertest';
import { sql } from 'drizzle-orm';

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
    await database.close();
  }

  /**
   * Clear the database.
   */
  async clearDatabase() {
    const database = this.container.get<IDatabase>(SERVICES_DI_TYPES.Database);
    const db = database.getInstance();

    const query = sql`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

    const results = await db.execute(query); // retrieve tables

    const tableNames = results.rows.map((row) => `"${row.table_name}"`).join(', ');

    const truncateQuery = sql.raw(`TRUNCATE TABLE ${tableNames} CASCADE;`);
    await db.execute(truncateQuery); // Truncate (clear all the data) the table
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

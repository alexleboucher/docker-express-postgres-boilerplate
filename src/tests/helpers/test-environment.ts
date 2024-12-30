import type { Container } from 'inversify';
import type { Server } from 'http';

import type { IDatabase } from '@/infra/database';
import { SERVICES_DI_TYPES } from '@/container/di-types';

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
}
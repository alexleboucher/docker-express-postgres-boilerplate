import { injectable } from 'inversify';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

import * as userSchema from './schemas/user';

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
};


// Helper function to create db instance with proper typing
const buildDrizzle = (pool: Pool) => drizzle({
  schema: { ...userSchema },
  client: pool,
});

export interface IDatabase {
  destroyIfInitialized(): Promise<void>;
  getInstance(): ReturnType<typeof buildDrizzle>;
  initialize(): Promise<void>;
}

@injectable()
export class Database implements IDatabase {
  private instance: ReturnType<typeof buildDrizzle>;
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    const pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
    });
    this.pool = pool;
    this.instance = buildDrizzle(pool);
  }

  async initialize() {
    return migrate(this.instance, { migrationsFolder: 'src/infra/database/migrations' });
  }

  getInstance() {
    return this.instance;
  }

  async destroyIfInitialized() {
    await this.pool.end();
  }
}
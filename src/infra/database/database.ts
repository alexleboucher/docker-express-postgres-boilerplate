import { injectable } from 'inversify';
import { DataSource, type EntityTarget, type ObjectLiteral, type QueryRunner, type Repository } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export type DatabaseConfig = {
  type: PostgresConnectionOptions['type'];
  host: PostgresConnectionOptions['host'];
  port: PostgresConnectionOptions['port'];
  username: PostgresConnectionOptions['username'];
  password: PostgresConnectionOptions['password'];
  database: PostgresConnectionOptions['database'];
  logging: PostgresConnectionOptions['logging'];
  migrationsRun: PostgresConnectionOptions['migrationsRun'];
  entities: PostgresConnectionOptions['entities'];
  migrations: PostgresConnectionOptions['migrations'];
};

export interface IDatabase {
  initialize(): Promise<DataSource>;
  destroyIfInitialized(): Promise<void>;
  getDataSource: () => DataSource;
  createQueryRunner: () => QueryRunner;
  getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity>;
}

@injectable()
export class Database implements IDatabase {
  private dataSource: DataSource;

  constructor(config: DatabaseConfig) {
    this.dataSource = new DataSource(config);
  }

  initialize() {
    return this.dataSource.initialize();
  }

  async destroyIfInitialized() {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>) {
    return this.dataSource.getRepository(target);
  }

  createQueryRunner() {
    return this.dataSource.createQueryRunner();
  }

  getDataSource() {
    return this.dataSource;
  }
}
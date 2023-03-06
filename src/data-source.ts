import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    synchronize: false,
    entities: [process.env.TYPEORM_ENTITIES ?? 'src/entities/**/*.ts'],
    subscribers: [process.env.TYPEORM_SUBSCRIBERS ?? 'src/subscribers/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
});
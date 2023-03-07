import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { join } from "path";

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
    entities: process.env.NODE_ENV === "production"
        ? ["build/entities/**/*.js"]
        : [join(__dirname, "./entities/**/*.ts")],
    subscribers: process.env.NODE_ENV === "production"
        ? ["build/subscribers/**/*.js"]
        : [join(__dirname, "./subscribers/**/*.ts")],
    migrations: process.env.NODE_ENV === "production"
        ? ["build/migrations/**/*.js"]
        : [join(__dirname, "./migrations/**/*.ts")],
});
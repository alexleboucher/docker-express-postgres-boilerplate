import { defineConfig } from 'drizzle-kit';

import { booleanEnv, env, mandatoryEnv, mandatoryIntegerEnv } from '@/core/env/env';

const isTest = mandatoryEnv('NODE_ENV') === 'test';

const host = isTest ? mandatoryEnv('TEST_DB_HOST') : mandatoryEnv('DB_HOST');
const port = isTest ? mandatoryIntegerEnv('TEST_DB_PORT') : mandatoryIntegerEnv('DB_PORT');
const database = isTest ? mandatoryEnv('TEST_DB_NAME') : mandatoryEnv('DB_NAME');
const ssl = isTest ? false : booleanEnv('DB_SSL', false);
const user = mandatoryEnv('DB_USER');
const password = mandatoryEnv('DB_PASSWORD');
const schema = env('DRIZZLE_SCHEMA', 'src/infra/database/schemas');
const out = env('DRIZZLE_OUT', 'src/infra/database/migrations');

export default defineConfig({
  schema,
  out,
  dialect: 'postgresql',
  dbCredentials: {
    host,
    port,
    user,
    password,
    database,
    ssl,
  }
});
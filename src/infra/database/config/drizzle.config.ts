import { defineConfig } from 'drizzle-kit';

import { booleanEnv, mandatoryEnv, mandatoryIntegerEnv } from '@/core/env/env';

const isTest = mandatoryEnv('NODE_ENV') === 'test';

const host = isTest ? mandatoryEnv('TEST_DB_HOST') : mandatoryEnv('DB_HOST');
const port = isTest ? mandatoryIntegerEnv('TEST_DB_PORT') : mandatoryIntegerEnv('DB_PORT');
const username = mandatoryEnv('DB_USER');
const password = mandatoryEnv('DB_PASSWORD');
const database = isTest ? mandatoryEnv('TEST_DB_NAME') : mandatoryEnv('DB_NAME');
const ssl = isTest ? false : booleanEnv('DB_SSL', false);

export default defineConfig({
  schema: 'src/infra/database/schemas',
  out: 'src/infra/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    port,
    user: username,
    password,
    database,
    ssl,
  }
});
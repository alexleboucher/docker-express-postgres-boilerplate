import * as dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

import { createServer } from '@/app/server';
import { setupContainer } from '@/container';
import { env } from '@/core/env';
import type { IDatabase } from '@/infra/database';
import { CORE_DI_TYPES, SERVICES_DI_TYPES } from '@/container/di-types';
import type { ILogger } from '@/core/logger';

const host = env('HOST', '0.0.0.0');
const port = env('PORT', '8080');

setupContainer().then((container) => {
  const server = createServer(container);
  const database = container.get<IDatabase>(SERVICES_DI_TYPES.Database);
  const logger = container.get<ILogger>(CORE_DI_TYPES.Logger);
  database.initialize()
    .then(() => {
      server.build().listen({ host, port }, () => {
        logger.info(`⚡️ Server is running at http://${host}:${port}`);
      });
    })
    .catch(logger.error);
})
  .catch((error) => { throw error; });
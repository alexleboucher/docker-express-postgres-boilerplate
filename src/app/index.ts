import 'reflect-metadata';

import { createServer } from '@/app/server';
import { env } from '@/core/env/env';
import { setupContainer } from '@/container/container';
import type { IDatabase } from '@/infra/database/database';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import { CORE_DI_TYPES } from '@/container/core/di-types';
import type { ILogger } from '@/core/logger/logger.interface';

const host = env('HOST', '0.0.0.0');
const port = env('PORT', '8080');

setupContainer()
  .then((container) => {
    const server = createServer(container);
    const database = container.get<IDatabase>(SERVICES_DI_TYPES.Database);
    const logger = container.get<ILogger>(CORE_DI_TYPES.Logger);
    database.initialize()
      .then(() => {
        server.listen({ host, port }, () => {
          logger.info(`⚡️ Server is running at http://${host}:${port}`);
        });
      })
      .catch(logger.error);
  })
  .catch((error) => { throw error; });
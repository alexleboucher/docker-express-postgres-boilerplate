import 'reflect-metadata';

import { createServer } from '@/app/server';
import { env } from '@/core/env/env';
import { setupContainer } from '@/container/container';
import { CORE_DI_TYPES } from '@/container/core/di-types';
import type { ILogger } from '@/core/logger/logger.interface';

const host = env('HOST', '0.0.0.0');
const port = env('PORT', '8080');

setupContainer()
  .then((container) => {
    const server = createServer(container);
    const logger = container.get<ILogger>(CORE_DI_TYPES.Logger);
    server.listen({ host, port }, () => {
      logger.info(`⚡️ Server is running at http://${host}:${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console -- we cannot use the logger here because it is not initialized yet
    console.error('❌ Failed to start server:', error);
  });
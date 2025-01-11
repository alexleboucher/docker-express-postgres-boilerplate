// To run ORM CLI commands, we need to provide the data source to the ORM.
// This file is responsible for building the data source and exporting it.
// So we just create the container, register the database, and get the data source.
import dotenv from 'dotenv';
dotenv.config();

import { setupContainer } from '@/container/container';
import type { IDatabase } from '@/infra/database/database';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';

const buildDataSource = async () => {
  const container = await setupContainer({ onlyDatabase: true });
  return container.get<IDatabase>(SERVICES_DI_TYPES.Database).getDataSource();
};

export default buildDataSource();
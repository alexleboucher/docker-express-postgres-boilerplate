import 'reflect-metadata';

import { mock } from 'jest-mock-extended';

import { setupContainer } from '@/container/container';
import { SERVICES_DI_TYPES } from '@/container/services/di-types';
import type { IDatabase } from '@/infra/database/database';
import { TestEnvironment } from '@/tests/helpers/test-environment';
import { createServer } from '@/app/server';

type CreateTestServerOptions = {
  port?: number;
  connectDatabase?: boolean;
};
/**
 * Create a test environment.
 * @param options - Options used to create the test server. Optional.
 * @param options.port - Port used to listen server. Default 7777. Optional.
 * @param options.connectDatabase - Connect to the database. Default true. Optional.
 * @returns The created test environment.
 */
export const createTestEnvironment = async (options?: CreateTestServerOptions): Promise<TestEnvironment> => {
  const { port = 7777, connectDatabase = true } = options || {};

  const container = await setupContainer();

  const server = createServer(container);

  if (connectDatabase) {
    const database = container.get<IDatabase>(SERVICES_DI_TYPES.Database);
    await database.initialize();
  }

  return new TestEnvironment(server.listen(port), container);
};


/**
 * Create a mock table with common drizzle query methods
 */
const createMockTable = () => ({
  findFirst: jest.fn(),
  findMany: jest.fn(),
});

/**
 * Create a clean mocked database shaped like drizzle's instance used in repositories.
 * Returns helpers to easily control nested calls without wiring each level manually.
 *
 * @param tableNames - Array of table names to create mocks for (e.g., ['userTable', 'postTable'])
 */
export const createMockDrizzleDatabase = <T extends readonly string[]>(tableNames: T) => {
  const database = mock<IDatabase>();

  // Create table mocks dynamically with proper typing
  const tables = {} as Record<T[number], ReturnType<typeof createMockTable>>;
  for (const tableName of tableNames) {
    (tables as Record<string, ReturnType<typeof createMockTable>>)[tableName] = createMockTable();
  }

  const query = {
    ...tables,
  } as unknown as ReturnType<IDatabase['getInstance']>['query'];

  // transaction(fn) where fn receives tx with insert(...).values(...).returning()
  const txReturning = jest.fn();
  const txValues = jest.fn().mockReturnValue({ returning: txReturning });
  const txInsert = jest.fn().mockReturnValue({ values: txValues });

  const instance = {
    query,
    transaction: jest.fn((callback: (tx: { insert: typeof txInsert }) => Promise<unknown> | unknown) => callback({ insert: txInsert })),
  } as unknown as ReturnType<IDatabase['getInstance']>;

  database.getInstance.mockReturnValue(instance);

  return {
    database,
    instance,
    query,
    tables,
    txInsert,
    txValues,
    txReturning,
  } as const;
};

type OperatorName =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'exists'
  | 'notExists'
  | 'isNull'
  | 'isNotNull'
  | 'inArray'
  | 'notInArray'
  | 'between'
  | 'notBetween'
  | 'like'
  | 'ilike'
  | 'notIlike'
  | 'not'
  | 'and'
  | 'or'
  | 'arrayContains'
  | 'arrayContained'
  | 'arrayOverlaps';

// Ce type indexé permet de récupérer les mocks pour chaque opérateur
type OpMocks = {
  [K in OperatorName]: jest.Mock;
};

/**
 * Inspecte une fonction `where` passée à Drizzle, en remplaçant
 * tous les opérateurs disponibles par des mocks pour voir ce qui est appelé.
 *
 * @param whereFn La callback where: (table, operators) => some condition
 * @param tableFake Un faux objet représentant la table, avec les propriétés colonnes utilisées
 * @returns opMocks : un objet contenant les mocks pour chaque opérateur
 */
export function inspectWhere(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
  whereFn: (table: any, operators: Partial<Record<OperatorName, Function>>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableFake: any
): OpMocks {
  // Créer un mock pour chaque opérateur
  const opMocks = {} as OpMocks;
  const operatorList: OperatorName[] = [
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'exists',
    'notExists',
    'isNull',
    'isNotNull',
    'inArray',
    'notInArray',
    'between',
    'notBetween',
    'like',
    'ilike',
    'notIlike',
    'not',
    'and',
    'or',
    'arrayContains',
    'arrayContained',
    'arrayOverlaps'
  ];

  for (const name of operatorList) {
    opMocks[name] = jest.fn();
  }

  // Appeler la callback with le tableFake et l'objet d'opérateurs mockés
  whereFn(tableFake, opMocks);

  return opMocks;
}
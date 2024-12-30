import request from 'supertest';

import { createTestEnvironment } from '@/tests/helpers/tests-helpers';
import type { TestEnvironment } from '@/tests/helpers/test-environment';

let testEnv: TestEnvironment;
beforeAll(async () => {
  testEnv = await createTestEnvironment({ connectDatabase: false });
});

afterAll(async () => {
  await testEnv.close();
});

describe('GET /health', () => {
  test('Return a 200', async () => {
    const res = await request(testEnv.server).get('/health');
    expect(res.statusCode).toEqual(200);
  });
});

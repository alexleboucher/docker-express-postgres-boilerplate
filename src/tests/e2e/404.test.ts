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

describe('404', () => {
  test('Send 404 if route does not exist', async () => {
    const res = await request(testEnv.server).get('/not-existing-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      message: 'Resource not found',
      name: 'NotFound',
      status: 404,
    });
  });
});

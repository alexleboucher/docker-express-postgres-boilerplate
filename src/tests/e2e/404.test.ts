import { createTestEnvironment } from '@/tests/helpers/test-helpers';
import type { TestEnvironment } from '@/tests/helpers/test-environment';

let testEnv: TestEnvironment;

beforeAll(async () => {
  // We don't need to connect to the database for this test
  testEnv = await createTestEnvironment({ connectDatabase: false });
});

afterAll(async () => {
  await testEnv.close();
});

describe('404', () => {
  test('Send 404 if route does not exist', async () => {
    const res = await testEnv.request().get('/not-existing-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      message: 'Resource not found',
      name: 'NotFound',
      status: 404,
    });
  });
});

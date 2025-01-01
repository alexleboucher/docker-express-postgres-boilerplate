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

describe('GET /health', () => {
  test('Return a 200', async () => {
    const res = await testEnv.request().get('/health');
    expect(res.statusCode).toEqual(200);
  });
});

import { createTestEnvironment } from '@/tests/helpers/test-helpers';
import type { TestEnvironment } from '@/tests/helpers/test-environment';

let testEnv: TestEnvironment;

beforeAll(async () => {
  testEnv = await createTestEnvironment();
});

afterAll(async () => {
  await testEnv.close();
});

describe('GET auth/authenticated', () => {
  beforeEach(async () => {
    await testEnv.clearDatabase();
  });

  test('Return true when user is authenticated', async () => {
    const request = await testEnv.authenticatedRequest();

    const res = await request.get('/auth/authenticated');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      authenticated: true,
    });
  });

  test('Return false when user is not authenticated', async () => {
    const res = await testEnv.request().get('/auth/authenticated');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      authenticated: false,
    });
  });
});
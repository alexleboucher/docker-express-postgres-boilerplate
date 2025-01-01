import { createTestEnvironment } from '@/tests/helpers/test-helpers';
import type { TestEnvironment } from '@/tests/helpers/test-environment';

let testEnv: TestEnvironment;

beforeAll(async () => {
  testEnv = await createTestEnvironment();
});

afterAll(async () => {
  await testEnv.close();
});

describe('POST auth/logout', () => {
  beforeEach(async () => {
    await testEnv.clearDatabase();
  });

  test('Logout a user', async () => {
    const { agent } = await testEnv.createAuthenticatedAgent();

    const res = await agent.post('/auth/logout');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      success: true,
    });
  });
});
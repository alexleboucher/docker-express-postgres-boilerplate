import { createTestEnvironment } from '@/tests/helpers/test-helpers';
import type { TestEnvironment } from '@/tests/helpers/test-environment';
import { createTestUser } from '@/tests/helpers/user-helpers';

let testEnv: TestEnvironment;

beforeAll(async () => {
  testEnv = await createTestEnvironment();
});

afterAll(async () => {
  await testEnv.close();
});

describe('POST auth/login', () => {
  beforeEach(async () => {
    await testEnv.clearDatabase();
  });

  test('Log a user', async () => {
    const username = 'fakeUser';
    const email = 'fakeUser@gmail.com';
    const password = 'fakeUserPwd';

    await createTestUser(testEnv, { username, email, password });

    const res = await testEnv.request()
      .post('/auth/login')
      .send({ email, password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      user: {
        id: expect.any(String),
        username,
        email,
      },
      token: expect.any(String),
    });
  });
});
import { createTestEnvironment } from '@/tests/helpers/test-helpers';
import type { TestEnvironment } from '@/tests/helpers/test-environment';

let testEnv: TestEnvironment;

beforeAll(async () => {
  testEnv = await createTestEnvironment();
});

afterAll(async () => {
  await testEnv.close();
});

describe('POST /users', () => {
  beforeEach(async () => {
    await testEnv.clearDatabase();
  });

  test('Create a user', async () => {
    const username = 'fakeUser';
    const email = 'fakeUser@gmail.com';
    const password = 'fakeUserPwd';

    const res = await testEnv.request()
      .post('/users')
      .send({ username, email, password });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      username,
      email,
    });
  });
});
import { Server } from 'http';
import request from 'supertest';

import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from '../utils/testsHelpers';
import { createTestUser } from '../utils/userHelpers';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
})

describe('Auth routes', () => {
    afterEach(async () => {
        await clearDatabase();
    })

    test('Send "You are authenticated" for authenticated user', async () => {
        const agent = await createAuthenticatedAgent(server);

        const res = await agent.get('/api/auth/authenticated');
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('You are authenticated');
    });

    test('Send "You are not authenticated" for non authenticated user', async () => {
        const res = await request(server).get('/api/auth/authenticated');
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('You are not authenticated');
    });

    test('Log user by username', async () => {
        const username = 'fakeUser';
        const password = 'fakeUserPwd';
        const user = await createTestUser({ username, password });

        const res = await request(server).post('/api/auth/login').send({ login: username, password });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
            id: user.id,
            username: user.username,
            email: user.email,
        })
    });

    test('Log user by email', async () => {
        const email = 'fakeUser@gmail.com';
        const password = 'fakeUserPwd';
        const user = await createTestUser({ email, password });

        const res = await request(server).post('/api/auth/login').send({ login: email, password });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({
            id: user.id,
            username: user.username,
            email: user.email,
        })
    });

    test('Login fails if wrong credentials', async () => {
        const username = 'fakeUser';
        const password = 'fakeUserPwd';
        await createTestUser({ username, password });

        // Wrong login
        const res1 = await request(server).post('/api/auth/login').send({ login: 'wrongLogin', password });

        expect(res1.statusCode).toEqual(401);
        expect(res1.body.message).toEqual('Incorrect credentials');

        // Wrong password
        const res2 = await request(server).post('/api/auth/login').send({ login: username, password: 'wrongPassword' });

        expect(res2.statusCode).toEqual(401);
        expect(res2.body.message).toEqual('Incorrect credentials');
    });

    test('Login fails if request body is invalid', async () => {
        // Missing login
        const res1 = await request(server).post('/api/auth/login').send({ password: 'password' });
        
        expect(res1.statusCode).toEqual(400);
        expect(res1.body.message).toEqual('Username or email address required');

        // Missing password
        const res2 = await request(server).post('/api/auth/login').send({ login: 'login' });
        
        expect(res2.statusCode).toEqual(400);
        expect(res2.body.message).toEqual('Password required');
    });
});
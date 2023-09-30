import { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';
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
        });
        expect(res.headers['set-cookie']).toBeDefined();
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
        });
        expect(res.headers['set-cookie']).toBeDefined();
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

    test('Throw an error if authenticated user tries to login', async () => {
        const username = 'fakeUser';
        const password = 'fakeUserPwd';
        const agent = await createAuthenticatedAgent(server, { username, password });

        const res = await agent.post('/api/auth/login').send({ login: username, password });
        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toEqual('User must not be authenticated');
    });

    test('Throw an error if an error occurs during Passport authentication', async () => {
        const username = 'fakeUser';
        const password = 'fakeUserPwd';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(AppDataSource, 'getRepository').mockImplementationOnce(_ => { throw 'Repo error' });

        const res = await request(server).post('/api/auth/login').send({ login: username, password });
        
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Unexpected error');
    });

    test('Throw an error if an error occurs during Express login', async () => {
        const serverFailingLogIn = await createTestServer(7778, true, {
            logIn: (_, cb) => { cb('Error') },
        });

        const username = 'fakeUser';
        const password = 'fakeUserPwd';
        await createTestUser({ username, password });

        const res = await request(serverFailingLogIn).post('/api/auth/login').send({ login: username, password });
        
        try {
            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toEqual('Unexpected error');
        } finally {
            // Use finally to always close the server, even if the tests fail
            serverFailingLogIn.close();
        }
    });

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

    test('Authenticated user is considered as non authenticated if user has been deleted', async () => {
        const username = 'fakeUser';
        const agent = await createAuthenticatedAgent(server, { username });

        const repo = AppDataSource.getRepository(User);
        await repo.delete({ username });

        const res = await agent.get('/api/auth/authenticated');
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('You are not authenticated');
    });

    test('Logout user', async () => {
        const agent = await createAuthenticatedAgent(server);

        const res = await agent.post('/api/auth/logout');
        
        expect(res.statusCode).toEqual(200);
        expect(res.headers['set-cookie']).toBeUndefined();
    });

    test('Throw an error if unauthenticated user tries to logout', async () => {
        const res = await request(server).post('/api/auth/logout');
        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toEqual('User must be authenticated');
    });

    test('Throw an error if an error occurs during Express logout', async () => {
        const serverFailingLogout = await createTestServer(7778, true, {
            logout: (cb) => { cb('Error') },
        });
        const agent = await createAuthenticatedAgent(serverFailingLogout);
        const res = await agent.post('/api/auth/logout');

        try {
            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toEqual('Unexpected error');
        } finally {
            // Use finally to always close the server, even if the tests fail
            serverFailingLogout.close();
        }
    });
});
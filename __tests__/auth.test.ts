import { Server } from 'http';
import request from 'supertest';

import { clearDatabase, closeDatabase, createAuthenticatedAgent, createTestServer } from './utils/testsHelpers';

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

    it('authenticated route should return "You are authenticated" for authenticated user', async () => {
        const agent = await createAuthenticatedAgent(server);

        const res = await agent.get('/api/auth/authenticated');
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toStrictEqual('You are authenticated');
    });

    it('authenticated route should return "You are not authenticated" for non authenticated user', async () => {
        const res = await request(server).get('/api/auth/authenticated');
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toStrictEqual('You are not authenticated');
    });
});
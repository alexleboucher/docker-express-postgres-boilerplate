import request from 'supertest';
import { Server } from 'http';

import { closeDatabase, createTestServer } from './utils/testsHelpers';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Server is up', () => {
    it('health should return "Server is up!"', async () => {
        const res = await request(server).get('/api/health');

        expect(res.statusCode).toEqual(200);
        expect(res.text).toStrictEqual('Server is up!');
    });
});

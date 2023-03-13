import request from 'supertest';
import { Server } from 'http';

import { closeDatabase, createTestServer } from '../utils/testsHelpers';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('Server is up', () => {
    test('Send "Server is up!"', async () => {
        const res = await request(server).get('/api/health');

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Server is up!');
    });
});

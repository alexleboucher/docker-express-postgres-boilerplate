import { Server } from "http";
import request from 'supertest';

import createServer from "../../src/config/server";
import { AppDataSource } from "../../src/data-source";
import { createTestUser, TestUserProps } from "./userHelpers";

export const createTestServer = async () => {
    const server = createServer();
    await AppDataSource.initialize();
    return server.listen(7777);
}

export const closeDatabase = async () => {
    await AppDataSource.destroy();
}

export const clearDatabase = async () => {
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.clear();
    }
}

export const createAgent = (server: Server) => {
    const agent = request.agent(server);
    return agent;
}

export const createAuthenticatedAgent = async (server: Server, testUser?: TestUserProps) => {
    const agent = request.agent(server);
    const user = await createTestUser(testUser);
    await agent.post('/api/auth/login').send({ login: user.username, password: testUser?.password || 'password' });
    return agent;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "http";
import request from 'supertest';
import { Express } from 'express';

import createServer from "../../src/config/server";
import { AppDataSource } from "../../src/data-source";
import { createTestUser, TestUserProps } from "./userHelpers";

interface OverrideExpressOptions {
    logout?: (cb: any) => unknown;
    logIn?: (user: any, cb: any) => unknown;
}

const overrideExpressServer = (server: Express, overrideExpressOptions: OverrideExpressOptions) => {
    if (overrideExpressOptions.logout) {
        server.request.logOut = overrideExpressOptions.logout;
    }
    if (overrideExpressOptions.logIn) {
        server.request.logIn = overrideExpressOptions.logIn;
    }
    return server;
}

export const createTestServer = async (port = 7777, preventDataSourceInit = false, overrideExpressOptions?: OverrideExpressOptions) => {
    const server = createServer();
    if (overrideExpressOptions) {
        overrideExpressServer(server, overrideExpressOptions);
    }

    if (!preventDataSourceInit) {
        await AppDataSource.initialize();
    }

    return server.listen(port);
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
    const agent = createAgent(server);
    const user = await createTestUser(testUser);
    await agent.post('/api/auth/login').send({ login: user.username, password: testUser?.password || 'password' });
    return agent;
}
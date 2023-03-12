import * as dotenv from 'dotenv';
import createHttpError from 'http-errors';
import 'reflect-metadata';
dotenv.config();

import createServer from './config/express';
import { errorHandler } from './middlewares/errorHandler';
import { AppDataSource } from './data-source';
import passport from './config/passport';
import apiRoutes from './routes/api';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8080';

const app = createServer();

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

app.use(`/${process.env.API_ROUTES_PREFIX}`, apiRoutes);
app.get('/*', (req, res) => {
    throw createHttpError(400, 'Resource Not Found');
});

app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
        app.listen({ host, port }, () => {
            console.info(`⚡️ Server is running at http://${host}:${port}`);
        });
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((err: any) => console.error(err));
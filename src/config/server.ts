import cors from 'cors';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import createHttpError from 'http-errors';

import { errorHandler } from '../middlewares/errorHandler';
import passport from './passport';
import apiRoutes from '../routes/api';

const createServer = () => {
    const app = express();

    const corsOptions = {
        origin: process.env.CORS_ORIGIN_ALLOWED,
        credentials: true,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    app.use(morgan('dev'));
    app.use(cors(corsOptions));
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(helmet());

    app.set('json spaces', 2);

    const sessionStore = new (pgSession(session))({
        conObject: {
            host: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_HOST : process.env.DB_HOST,
            port: process.env.NODE_ENV === 'test' ? Number(process.env.TEST_DB_PORT) : Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
        },
        createTableIfMissing: true,
    });

    app.use(
        session({
            store: sessionStore,
            secret: 'docker-express-boilerplate-api',
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: process.env.NODE_ENV == 'production' ? true : false,
                httpOnly: process.env.NODE_ENV == 'production' ? true : false,
                sameSite: 'lax',
                maxAge: 90 * 24 * 60 * 60 * 1000, // 3 months
            },
        }),
    );

    // Passport authentication
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(`/${process.env.API_ROUTES_PREFIX}`, apiRoutes);
    app.get('/*', (req, res) => {
        throw createHttpError(400, 'Resource Not Found');
    });

    app.use(errorHandler);

    return app;
};

export default createServer;
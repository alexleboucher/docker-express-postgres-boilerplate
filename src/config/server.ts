import cors from 'cors';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import createHttpError from 'http-errors';

import session from './session';
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

    app.use(session);

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(`/${process.env.API_ROUTES_PREFIX}`, apiRoutes);
    app.get('/*', (req, res) => {
        throw createHttpError(404, 'Resource Not Found');
    });

    app.use(errorHandler);

    return app;
};

export default createServer;
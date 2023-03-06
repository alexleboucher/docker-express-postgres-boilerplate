import cors from 'cors';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

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
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
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

    return app;
};

export default createServer;
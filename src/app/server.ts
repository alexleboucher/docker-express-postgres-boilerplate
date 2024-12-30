import cors from 'cors';
import helmet from 'helmet';
import type { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import morgan from 'morgan';
import { json, urlencoded } from 'express';

import type { IErrorMiddleware } from '@/app/middlewares';
import type { IAuthenticator, ISessionManager } from '@/domain/services/auth';
import { HttpError } from '@/app/http-error';
import { MIDDLEWARES_DI_TYPES, SERVICES_DI_TYPES } from '@/container/di-types';

export const createServer = (container: Container) => {
  const corsOptions = {
    origin: process.env.CORS_ORIGIN_ALLOWED,
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  const server = new InversifyExpressServer(container);

  server.setConfig((app) => {
    app.use(morgan('dev'));
    app.use(cors(corsOptions));
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(helmet());
    app.set('json spaces', 2);

    const session = container.get<ISessionManager>(SERVICES_DI_TYPES.SessionManager);
    app.use(session.configure());

    const authenticator = container.get<IAuthenticator>(SERVICES_DI_TYPES.Authenticator);
    authenticator.configure();
    app.use(authenticator.session());
  });

  server.setErrorConfig((app) => {
    // This is the last request middleware, if no other middleware handled the request, it means
    // this route doesn't exist, so we throw a not found error
    app.use((req, res) => {
      throw HttpError.notFound('Resource not found');
    });

    const errorMiddleware = container.get<IErrorMiddleware>(MIDDLEWARES_DI_TYPES.ErrorMiddleware);
    app.use(errorMiddleware.handler.bind(errorMiddleware));
  });

  return server;
};
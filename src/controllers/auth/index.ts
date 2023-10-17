import type { NextFunction, Request, Response } from 'express';
import type { HttpError } from 'http-errors';
import createHttpError from 'http-errors';
import passport from 'passport';

import type { AuthLoginBody, AuthLoginResponse } from '../../types/routes/auth';
import type { User } from '../../entities/user';
import { validateLoginBody } from './validators';

const login = (
    req: TypedRequestBody<AuthLoginBody>,
    res: Response<AuthLoginResponse>,
    next: NextFunction,
) => {
    validateLoginBody(req.body);

    passport.authenticate(
        'local',
        (err: HttpError | null, user: User | undefined) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(
                    createHttpError(401, 'Incorrect credentials'),
                );
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                });
            });
        },
    )(req, res, next);
};

const logout = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => res.send());
    });
};

const authenticated = (
    req: Request,
    res: Response,
) => {
    if (req.isAuthenticated()) {
        res.send('You are authenticated');
    } else {
        res.send('You are not authenticated');
    }
};

export default {
    login,
    logout,
    authenticated,
};
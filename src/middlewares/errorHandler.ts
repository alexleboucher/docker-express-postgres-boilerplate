import type { Request, Response, NextFunction } from 'express';
import type { HttpError as IHttpError } from 'http-errors';
import createHttpError, { isHttpError } from 'http-errors';

export const errorHandler = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let error: IHttpError;
    if (isHttpError(err)) {
        error = err;
    } else {
        // if the error is not an HttpError, it means the error is not handled,
        // so we throw an internal server error
        console.error('Internal server error:', err.message);
        error = createHttpError(500, err.message ?? 'Unexpected error');
    }

    const formatedError = {
        message: error.message,
        name: error.name,
        status: error.status,
    };

    res.status(error.statusCode).send(formatedError);
};
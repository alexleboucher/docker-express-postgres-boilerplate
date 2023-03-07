import { Response } from 'express';
import createHttpError from 'http-errors';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';

import { TypedRequestBody } from '../../types/express';
import { UsersCreateBody } from '../../types/routes/users';
import { validateCreateBody } from './validators';

const create = async (req: TypedRequestBody<UsersCreateBody>, res: Response) => {
    const { username, email, password } = validateCreateBody(req.body);

    // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
    const queryRunner = AppDataSource.createQueryRunner();

    // Connect the query runner to the database and start the transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepo = queryRunner.manager.getRepository(User);
        const usernameExists = await userRepo.exist({
            where: { username }
        });
        if (usernameExists) {
            throw createHttpError(409, 'Username already exists');
        }

        const emailExists = await userRepo.exist({
            where: { email }
        });
        if (emailExists) {
            throw createHttpError(409, 'Email already exists');
        }

        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.setPassword(password);
        await queryRunner.manager.save(newUser);

        // No exceptions occured, so we commit the transaction
        await queryRunner.commitTransaction();

        res.send(newUser.id);
    } catch (err) {
        // As an exception occured, cancel the transaction
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        // We need to release the query runner to not keep a useless connection to the database
        await queryRunner.release();
    }
};

export default {
    create,
};

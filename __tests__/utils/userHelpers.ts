import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';

export interface TestUserProps {
    username?: string;
    email?: string;
    password?: string;
}

/**
 * Create a user in database.
 * @param testUser - User informations. Optional.
 * @returns 
 */
export const createTestUser = async (testUser?: TestUserProps) => {
    const userRepo = AppDataSource.getRepository(User);

    const user = new User();
    user.username = testUser?.username || 'testUser';
    user.email = testUser?.email || 'testUser@gmail.com';
    user.setPassword(testUser?.password || 'password');

    await userRepo.save(user);
    return user;
};
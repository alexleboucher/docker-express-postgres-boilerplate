import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entities/user";

export interface TestUserProps {
    username?: string;
    email?: string;
    password?: string;
}

export const createTestUser = async (testUser?: TestUserProps) => {
    const userRepo = AppDataSource.getRepository(User);

    const user = new User();
    user.username = testUser?.username || 'testUser';
    user.email = testUser?.username || 'testUser@gmail.com';
    user.setPassword(testUser?.password || 'password');

    await userRepo.save(user);
    return user;
}
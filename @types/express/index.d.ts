import { User } from "../../src/entities/user";

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}
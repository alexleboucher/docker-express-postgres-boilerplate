import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { User } from '../entities/user';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
    listenTo(): typeof User {
        return User;
    }

    afterInsert(event: InsertEvent<User>): void {
        const user = event.entity;
        console.info(`User ${user.username} has been inserted`);
    }
}
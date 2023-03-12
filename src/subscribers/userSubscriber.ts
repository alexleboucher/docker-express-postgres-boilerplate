import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { User } from '../entities/user';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
    listenTo(): typeof User {
        return User;
    }

    async afterInsert(event: InsertEvent<User>): Promise<void> {
        const user = event.entity;
        console.log(`User ${user.username} has been inserted`);
    }
}
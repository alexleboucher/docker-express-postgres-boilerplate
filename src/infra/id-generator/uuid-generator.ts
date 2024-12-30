import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

import type { IIDGenerator } from '@/core/id';

@injectable()
export class UUIDGenerator implements IIDGenerator {
  generate() {
    return uuidv4();
  }
}
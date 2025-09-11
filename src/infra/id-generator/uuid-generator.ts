import { randomUUID } from 'crypto';
import { injectable } from 'inversify';

import type { IIDGenerator } from '@/core/id/id-generator.interface';

@injectable()
export class UUIDGenerator implements IIDGenerator {
  generate() {
    return randomUUID();
  }
}
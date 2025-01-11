import { injectable } from 'inversify';

import type { ITime } from '@/core/time/time.interface';

@injectable()
export class SystemTime implements ITime {
  now() {
    return new Date();
  }
}
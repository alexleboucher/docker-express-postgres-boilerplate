import { injectable } from 'inversify';

import type { ITime } from '@/core/time';

@injectable()
export class SystemTime implements ITime {
  now() {
    return new Date();
  }
}
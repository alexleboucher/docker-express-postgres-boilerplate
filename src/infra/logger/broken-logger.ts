import { injectable } from 'inversify';

import type { ILogger } from '@/core/logger';

// Logger that does nothing, used for testing to not pollute the console
@injectable()
export class BrokenLogger implements ILogger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
}
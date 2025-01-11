import { injectable } from 'inversify';

import type { ILogger } from '@/core/logger/logger.interface';

// Logger that does nothing, can be used in tests for example to avoid polluting the console
@injectable()
export class BrokenLogger implements ILogger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
}
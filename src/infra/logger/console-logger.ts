/* eslint-disable no-console -- We are using console for logging */
import { injectable } from 'inversify';

import type { ILogger } from '@/core/logger/logger.interface';

@injectable()
export class ConsoleLogger implements ILogger {
  debug(msg: unknown, ...params: unknown[]): void {
    if (params.length === 0) {
      console.debug(msg);
    } else {
      console.debug(msg, ...params);
    }
  }

  info(msg: unknown, ...params: unknown[]): void {
    if (params.length === 0) {
      console.info(msg);
    } else {
      console.info(msg, ...params);
    }
  }

  warn(msg: unknown, ...params: unknown[]): void {
    if (params.length === 0) {
      console.warn(msg);
    } else {
      console.warn(msg, ...params);
    }
  }

  error(msg: unknown, ...params: unknown[]): void {
    if (params.length === 0) {
      console.error(msg);
    } else {
      console.error(msg, ...params);
    }
  }
}
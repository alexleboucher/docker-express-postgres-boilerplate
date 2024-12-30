export interface ILogger {
  debug: (msg: unknown, ...params: unknown[]) => void;
  info: (msg: unknown, ...params: unknown[]) => void;
  warn: (msg: unknown, ...params: unknown[]) => void;
  error: (msg: unknown, ...params: unknown[]) => void;
}
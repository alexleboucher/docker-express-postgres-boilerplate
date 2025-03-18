export const MIDDLEWARES_DI_TYPES = {
  AuthenticatedMiddleware: Symbol.for('AuthenticatedMiddleware'),
  ErrorMiddleware: Symbol.for('ErrorMiddleware'),
  CurrentUserMiddleware: Symbol.for('CurrentUserMiddleware'),
};
export const REQUEST_HANDLERS_DI_TYPES = {
  LoginRequestHandler: Symbol.for('LoginRequestHandler'),
  LogoutRequestHandler: Symbol.for('LogoutRequestHandler'),
  AuthenticatedRequestHandler: Symbol.for('AuthenticatedRequestHandler'),
  CreateUserRequestHandler: Symbol.for('CreateUserRequestHandler'),
  HealthRequestHandler: Symbol.for('HealthRequestHandler'),
};
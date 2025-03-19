import { Router as ExpressRouter } from 'express';

abstract class BaseRouter {
  protected router = ExpressRouter();

  abstract setupRoutes(): void;

  getRouter() {
    this.setupRoutes();
    return this.router;
  }
}

export { BaseRouter };

import { mock } from 'jest-mock-extended';
import type { Request, Response } from 'express';

import { HealthRequestHandler } from '@/app/request-handlers/health/queries/health-request-handler';

describe('HealthRequestHandler', () => {
  test('Send success response', () => {
    const req = {} as Request;
    const res = mock<Response>();

    const handler = new HealthRequestHandler();
    handler.handler(req, res);

    expect(res.send).toHaveBeenCalledWith({
      success: true,
    });
  });
});

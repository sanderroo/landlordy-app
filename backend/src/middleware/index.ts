import { Application } from 'express';
import { rateLimiter } from './rateLimiter';
import { requestLogger } from './requestLogger';

export function setupMiddleware(app: Application): void {
  // Request logging
  app.use(requestLogger);
  
  // Rate limiting
  app.use(rateLimiter);
}
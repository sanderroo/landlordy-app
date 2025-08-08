import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    console.log(
      `${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms ${req.ip}`
    );
  });
  
  next();
}
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// General API rate limiter
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000, // 15 minutes
});

// Auth endpoints rate limiter (more restrictive)
const authRateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 5, // 5 attempts
  duration: 900, // 15 minutes
});

export async function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes?.remainingPoints || 0;
    const msBeforeNext = rejRes?.msBeforeNext || 0;
    
    res.set('Retry-After', Math.round(msBeforeNext / 1000).toString());
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      retryAfter: Math.round(msBeforeNext / 1000)
    });
  }
}

export async function authRateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    await authRateLimiter.consume(req.ip);
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes?.remainingPoints || 0;
    const msBeforeNext = rejRes?.msBeforeNext || 0;
    
    res.set('Retry-After', Math.round(msBeforeNext / 1000).toString());
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts',
      retryAfter: Math.round(msBeforeNext / 1000)
    });
  }
}

export { rateLimiterMiddleware as rateLimiter };

export { rateLimiter }
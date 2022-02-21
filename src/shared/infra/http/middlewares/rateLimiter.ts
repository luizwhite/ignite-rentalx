import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis, IRateLimiterRes } from 'rate-limiter-flexible';
import redis from 'redis';

import { AppError } from '@shared/errors/AppError';

const RATE_LIMIT_POINTS = 3;

const redisClient = redis.createClient({
  enable_offline_queue: false,
  password: process.env.REDIS_PASSWORD,
  port: Number(process.env.REDIS_PORT!),
  host: process.env.REDIS_HOST || 'localhost',
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: RATE_LIMIT_POINTS,
  duration: 1,
});

async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(req.ip);

    return next();
  } catch (err) {
    if (!(err instanceof Error)) {
      const rateLimiterRes = err as IRateLimiterRes;
      const { msBeforeNext, remainingPoints, consumedPoints } = rateLimiterRes;

      console.log({ IP: req.ip, msBeforeNext, consumedPoints });

      res.set({
        'Retry-After': msBeforeNext || (60 * 1000) / 1000,
        'X-RateLimit-Limit': RATE_LIMIT_POINTS,
        'X-RateLimit-Remaining': remainingPoints,
        'X-RateLimit-Reset': new Date(
          Date.now() + (msBeforeNext || 60 * 1000)
        ).toISOString(),
      });

      throw new AppError('Too many requests', 429);
    }

    throw new AppError(err.message);
  }
}

export { rateLimiter };

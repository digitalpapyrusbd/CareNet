import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limit tiers
export enum RateLimitTier {
  AUTH = 'auth', // 5 requests/min (prevent brute force)
  PAYMENT = 'payment', // 10 requests/min
  WEBHOOK = 'webhook', // 1000 requests/min (per IP)
  GENERAL = 'general', // 100 requests/min
}

// Decorator to set rate limit tier
export const RateLimit = (tier: RateLimitTier) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (propertyKey && descriptor) {
      Reflect.defineMetadata('rateLimit', tier, descriptor.value);
    } else {
      Reflect.defineMetadata('rateLimit', tier, target);
    }
  };
};

@Injectable()
export class ThrottleGuard implements CanActivate {
  private redis: Redis;
  private rateLimiters: Map<RateLimitTier, Ratelimit>;

  constructor(private reflector: Reflector) {
    // Initialize Redis connection
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL || 'http://localhost:6379',
      token: process.env.UPSTASH_REDIS_TOKEN || '',
    });

    // Initialize rate limiters for different tiers
    this.rateLimiters = new Map([
      [
        RateLimitTier.AUTH,
        new Ratelimit({
          redis: this.redis,
          limiter: Ratelimit.slidingWindow(5, '1 m'),
          analytics: true,
          prefix: 'ratelimit:auth',
        }),
      ],
      [
        RateLimitTier.PAYMENT,
        new Ratelimit({
          redis: this.redis,
          limiter: Ratelimit.slidingWindow(10, '1 m'),
          analytics: true,
          prefix: 'ratelimit:payment',
        }),
      ],
      [
        RateLimitTier.WEBHOOK,
        new Ratelimit({
          redis: this.redis,
          limiter: Ratelimit.slidingWindow(1000, '1 m'),
          analytics: true,
          prefix: 'ratelimit:webhook',
        }),
      ],
      [
        RateLimitTier.GENERAL,
        new Ratelimit({
          redis: this.redis,
          limiter: Ratelimit.slidingWindow(100, '1 m'),
          analytics: true,
          prefix: 'ratelimit:general',
        }),
      ],
    ]);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Skip rate limiting in development if no Redis configured
    if (!process.env.UPSTASH_REDIS_URL && process.env.NODE_ENV !== 'production') {
      return true;
    }

    // Get rate limit tier from metadata
    const tier =
      this.reflector.get<RateLimitTier>('rateLimit', context.getHandler()) ||
      this.reflector.get<RateLimitTier>('rateLimit', context.getClass()) ||
      RateLimitTier.GENERAL;

    // Get identifier (user ID or IP address)
    const user = request.user;
    const identifier = user?.id || request.ip || 'anonymous';

    // Get appropriate rate limiter
    const rateLimiter = this.rateLimiters.get(tier);

    if (!rateLimiter) {
      // Fallback to general if tier not found
      return true;
    }

    try {
      // Check rate limit
      const { success, limit, remaining, reset } = await rateLimiter.limit(
        `${tier}:${identifier}`,
      );

      // Add rate limit headers to response
      const response = context.switchToHttp().getResponse();
      response.setHeader('X-RateLimit-Limit', limit.toString());
      response.setHeader('X-RateLimit-Remaining', remaining.toString());
      response.setHeader('X-RateLimit-Reset', new Date(reset).toISOString());

      if (!success) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please try again later.',
            error: 'Too Many Requests',
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      // If rate limiting fails, allow the request (fail open)
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Rate limiting error:', error);
      return true;
    }
  }
}

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client using UPSTASH environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Sliding window: 100 requests per minute
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

export async function rateLimitMiddleware(identifier: string) {
  const { success, remaining, reset } = await ratelimit.limit(identifier);
  return { success, remaining, resetAt: reset };
}

export default rateLimitMiddleware;

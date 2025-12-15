import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type LimitOpts = { key?: string; limit?: number; windowSeconds?: number }

let upstashRatelimit: any = null

function getIpKey(req: Request) {
  const auth = (req as any).headers?.get?.('authorization') ?? (req as any).headers?.authorization
  if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7)
  const xfwd = (req as any).headers?.get?.('x-forwarded-for') || (req as any).headers?.get?.('x-real-ip')
  if (xfwd) return String(xfwd).split(',')[0].trim()
  return 'anonymous'
}

// Simple in-memory fallback limiter
const localBuckets = new Map<string, { count: number; resetAt: number }>()

async function localLimit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now()
  const entry = localBuckets.get(key)
  if (!entry || now > entry.resetAt) {
    localBuckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { success: true, remaining: limit - 1, reset: Date.now() + windowSeconds * 1000 }
  }
  entry.count += 1
  const remaining = Math.max(0, limit - entry.count)
  if (entry.count > limit) {
    return { success: false, remaining: 0, reset: entry.resetAt }
  }
  return { success: true, remaining, reset: entry.resetAt }
}

export async function rateLimitRequest(req: Request, opts?: LimitOpts) {
  const limit = opts?.limit ?? 20
  const windowSeconds = opts?.windowSeconds ?? 60
  const key = opts?.key ?? getIpKey(req)

  // Prefer Upstash if configured
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (url && token) {
      if (!upstashRatelimit) {
        const redis = new Redis({ url, token })
        upstashRatelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(limit, `${windowSeconds}s`) })
      }
      const res = await upstashRatelimit.limit(key)
      if (!res.success) {
        return NextResponse.json({ error: 'rate_limited', remaining: 0 }, { status: 429 })
      }
      return undefined
    }
  } catch (err) {
    // fall through to local limiter
    console.warn('Upstash rate-limit failed, falling back to local limiter', err)
  }

  const local = await localLimit(key, limit, windowSeconds)
  if (!local.success) {
    return NextResponse.json({ error: 'rate_limited', remaining: 0 }, { status: 429 })
  }
  return undefined
}

export default rateLimitRequest

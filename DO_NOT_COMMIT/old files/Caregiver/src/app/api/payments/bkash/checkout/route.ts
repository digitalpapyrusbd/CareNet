import { NextResponse } from 'next/server'
import { bkash } from '@/lib/payments'
import { CheckoutSchema } from '@/lib/payments/schemas'
import { extractTokenFromHeader, verifyAccessToken } from '@/lib/auth'
import rateLimitRequest from '@/lib/middleware/rateLimit'

export async function POST(req: Request) {
  try {
    const rl = await rateLimitRequest(req, { key: 'bkash_checkout', limit: 30, windowSeconds: 60 })
    if (rl) return rl
    const body = await req.json()

    // Validate shape
    const parsed = CheckoutSchema.safeParse({
      amount: typeof body.amount === 'string' ? Number(body.amount) : body.amount,
      currency: body.currency,
      reference: body.reference,
    })
    if (!parsed.success) return NextResponse.json({ error: 'invalid_payload', details: parsed.error.errors }, { status: 400 })

    // Authenticate request and require guardian role or make:payments permission
    const auth = await import('@/lib/middleware/request-auth')
    const authRes = await auth.authenticateRequest(req)
    if ((authRes as any).status) return authRes as any
    const { user } = authRes as any

    // allow guardians or users with make:payments permission
    if (user.role !== 'GUARDIAN' && !auth.hasPermission?.(user.role, 'make:payments')) {
      return auth.errorResponse('Forbidden', 'FORBIDDEN', 403)
    }

    const checkout = await bkash.createCheckout({ amount: Number(parsed.data.amount), currency: parsed.data.currency, reference: parsed.data.reference })
    return NextResponse.json({ ok: true, checkout })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}

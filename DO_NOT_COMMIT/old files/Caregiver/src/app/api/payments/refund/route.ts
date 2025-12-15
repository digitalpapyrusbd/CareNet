import { NextResponse } from 'next/server'
import { escrow, bkash, nagad } from '@/lib/payments'
import { RefundSchema } from '@/lib/payments/schemas'
import { extractTokenFromHeader, verifyAccessToken, hasPermission } from '@/lib/auth'
import rateLimitRequest from '@/lib/middleware/rateLimit'

export async function POST(req: Request) {
  try {
    const rl = await rateLimitRequest(req, { key: 'payments_refund', limit: 10, windowSeconds: 60 })
    if (rl) return rl
    const body = await req.json()
    const parsed = RefundSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'invalid_payload', details: parsed.error.errors }, { status: 400 })

    // Require authentication and permission to process refunds (manage:payments)
    const auth = await import('@/lib/middleware/request-auth')
    const authRes = await auth.authenticateRequest(req)
    if ((authRes as any).status) return authRes as any
    const { user } = authRes as any

    const authz = auth.authorizeRequest(user, 'manage:payments')
    if (authz) return authz as any

    const { escrowId, amount, reason, provider, transactionId } = parsed.data
    if (!escrowId) return NextResponse.json({ error: 'missing_escrowId' }, { status: 400 })

    if (provider && transactionId) {
      const prov = provider === 'bkash' ? bkash : provider === 'nagad' ? nagad : null
      if (!prov) return NextResponse.json({ error: 'unsupported_provider' }, { status: 400 })
      const tx = await (prov as any).getTransaction(transactionId)
      if (!tx) return NextResponse.json({ error: 'transaction_not_found' }, { status: 404 })
    }

    const result = await escrow.refundEscrow(escrowId, amount)
    return NextResponse.json({ ok: true, result, reason })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}

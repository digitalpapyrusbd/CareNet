import { NextResponse } from 'next/server'
import { bkash } from '@/lib/payments'
import { CallbackSchema } from '@/lib/payments/schemas'
import { verifyRequestSignature } from '@/lib/payments/webhooks'
import rateLimitRequest from '@/lib/middleware/rateLimit'

export async function POST(req: Request) {
  try {
    const rl = await rateLimitRequest(req, { key: 'bkash_callback', limit: 60, windowSeconds: 60 })
    if (rl) return rl
    // Verify webhook signature using env var BKASH_WEBHOOK_SECRET
    const { ok, raw } = await verifyRequestSignature(req, 'BKASH_WEBHOOK_SECRET', 'x-pay-signature')
    if (!ok) return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })

    let body
    try { body = JSON.parse(raw) } catch (e) { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }

    const parsed = CallbackSchema.safeParse({
      transactionId: body.transactionId || body.transactionID || body.txId,
      status: body.status,
      amount: typeof body.amount === 'string' ? Number(body.amount) : body.amount,
      provider: 'bkash',
    })
    if (!parsed.success) return NextResponse.json({ error: 'invalid_payload', details: parsed.error.errors }, { status: 400 })

    const result = await bkash.verifyPayment(parsed.data.transactionId)
    // Normally you'd update order/payment records here using prisma
    return NextResponse.json({ ok: true, result })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}
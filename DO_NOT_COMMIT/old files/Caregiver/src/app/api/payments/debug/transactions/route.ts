import { NextResponse } from 'next/server'
import { bkash, nagad } from '@/lib/payments'
import rateLimitRequest from '@/lib/middleware/rateLimit'

export async function GET(req: Request) {
  try {
    const rl = await rateLimitRequest(req, { key: 'payments_debug', limit: 5, windowSeconds: 60 })
    if (rl) return rl
    // require admin/moderator
    const auth = await import('@/lib/middleware/request-auth')
    const authRes = await auth.authenticateRequest(req)
    if ((authRes as any).status) return authRes as any
    const { user } = authRes as any
    const guard = auth.requireRole(user, ['SUPER_ADMIN', 'MODERATOR'])
    if (guard) return guard as any

    const bk = bkash.listTransactions ? await bkash.listTransactions() : []
    const ng = nagad.listTransactions ? await nagad.listTransactions() : []
    return NextResponse.json({ ok: true, bkash: bk, nagad: ng })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}

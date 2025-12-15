import { NextResponse } from 'next/server'
import { escrow } from '@/lib/payments'
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

    const list = escrow.listEscrows ? await escrow.listEscrows() : []
    return NextResponse.json({ ok: true, escrows: list })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 })
  }
}

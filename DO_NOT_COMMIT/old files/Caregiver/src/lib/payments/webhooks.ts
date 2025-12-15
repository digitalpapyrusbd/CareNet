import crypto from 'crypto'

export function computeSignature(secret: string, payload: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export async function verifyRequestSignature(req: Request, secretEnvVar: string, headerName = 'x-pay-signature') {
  const secret = process.env[secretEnvVar]
  if (!secret) return { ok: false, raw: '' }
  const raw = await req.text()
  const sig = computeSignature(secret, raw)
  const header = (req.headers.get(headerName) || '') as string
  let ok = false
  try {
    ok = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(header))
  } catch (e) {
    ok = false
  }
  return { ok, raw }
}

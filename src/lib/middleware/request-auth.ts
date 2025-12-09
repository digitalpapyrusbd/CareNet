import { NextResponse } from 'next/server'
import { extractTokenFromHeader, verifyAccessToken, hasPermission } from '@/lib/auth'
import { getUserById } from '@/lib/db-utils'

type AuthResult = {
  user: {
    id: string;
    role: string;
    phone?: string;
    email?: string;
    name?: string;
  }
}

export function errorResponse(message: string, code: string, status = 400) {
  return NextResponse.json({ error: message, code }, { status })
}

export async function authenticateRequest(req: Request): Promise<AuthResult | NextResponse> {
  try {
    const authHeader = req.headers.get('authorization') || undefined
    const token = extractTokenFromHeader(authHeader)
    if (!token) return errorResponse('Access token required', 'AUTH_REQUIRED', 401)

    let payload
    try {
      payload = verifyAccessToken(token)
    } catch (e) {
      return errorResponse('Invalid or expired token', 'AUTH_INVALID', 401)
    }

    const user = await getUserById(payload.userId)
    if (!user || !user.isActive) return errorResponse('Invalid user', 'AUTH_INVALID_USER', 401)

    return { user: { id: user.id, role: user.role as any, phone: user.phone, email: user.email || undefined, name: user.name } }
  } catch (err: any) {
    return errorResponse('Authentication failed', 'AUTH_ERROR', 500)
  }
}

export function authorizeRequest(authUser: any, permission: string) {
  try {
    if (!authUser) return errorResponse('Not authenticated', 'AUTH_REQUIRED', 401)
    if (!hasPermission(authUser.role, permission)) return errorResponse('Insufficient permissions', 'FORBIDDEN', 403)
    return null
  } catch (err: any) {
    return errorResponse('Authorization failed', 'AUTHZ_ERROR', 500)
  }
}

export function requireRole(authUser: any, roles: string[]) {
  if (!authUser) return errorResponse('Not authenticated', 'AUTH_REQUIRED', 401)
  if (!roles.includes(authUser.role)) return errorResponse('Insufficient role', 'FORBIDDEN', 403)
  return null
}

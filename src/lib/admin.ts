import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export async function changeUserRole(actor: any, targetUserId: string, newRole: string) {
  // Basic RBAC: only SUPER_ADMIN or MODERATOR can change roles (simplified)
  const actorRole = actor?.role || 'GUARDIAN';
  if (![UserRole.SUPER_ADMIN, UserRole.MODERATOR].includes(actorRole)) {
    return { status: 403, error: 'forbidden' };
  }

  // Validate role
  const allowedRoles = Object.values(UserRole || {});
  if (!allowedRoles.includes(newRole)) {
    return { status: 400, error: 'invalid_role' };
  }

  // Update user role (uses Prisma mock in tests)
  try {
    const updated = await prisma.user.update({ where: { id: targetUserId }, data: { role: newRole } });
    // Create an audit log entry
    await prisma.auditLog.createMany({ data: [{ actorId: actor?.id || null, action: 'change_role', meta: JSON.stringify({ targetUserId, newRole }) }] });
    return { status: 200, data: updated };
  } catch (err: any) {
    return { status: 500, error: 'server_error', details: err?.message };
  }
}

export async function moderateContent(actor: any, contentId: string, action: 'remove' | 'approve' | 'flag', reason?: string) {
  const actorRole = actor?.role || 'GUARDIAN';
  if (![UserRole.SUPER_ADMIN, UserRole.MODERATOR].includes(actorRole)) {
    return { status: 403, error: 'forbidden' };
  }

  try {
    // For simplicity, record moderation action in audit log and update a content table if present
    await prisma.auditLog.createMany({ data: [{ actorId: actor?.id || null, action: `moderate_${action}`, meta: JSON.stringify({ contentId, reason }) }] });
    // If content model exists, attempt a soft-update (best-effort)
    if ((prisma as any).content && typeof (prisma as any).content.update === 'function') {
      const updateData: any = { status: action === 'approve' ? 'APPROVED' : 'REMOVED' };
      await (prisma as any).content.update({ where: { id: contentId }, data: updateData });
    }
    return { status: 200, data: { contentId, action } };
  } catch (err: any) {
    return { status: 500, error: 'server_error', details: err?.message };
  }
}

export async function listAuditLogs(limit = 50) {
  try {
    const logs = await prisma.auditLog.findMany({ take: limit, orderBy: { createdAt: 'desc' } } as any);
    return { status: 200, data: logs };
  } catch (err: any) {
    return { status: 500, error: 'server_error', details: err?.message };
  }
}

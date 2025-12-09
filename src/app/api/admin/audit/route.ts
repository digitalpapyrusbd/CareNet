import { NextResponse } from 'next/server';
import { listAuditLogs } from '@/lib/admin';

export async function GET() {
  try {
    const result = await listAuditLogs(100);
    if (result.status !== 200) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Allow a simple manual audit log create for testing purposes
    const { actorId, action, meta } = body;
    // write directly using Prisma to avoid creating another helper here
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.auditLog.createMany({ data: [{ actorId: actorId || null, action: action || 'custom', meta: JSON.stringify(meta || {}) }] });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

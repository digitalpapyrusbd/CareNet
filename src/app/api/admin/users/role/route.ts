import { NextResponse } from 'next/server';
import { changeUserRole } from '@/lib/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUserId, newRole, actor } = body;
    if (!targetUserId || !newRole) {
      return NextResponse.json({ success: false, error: 'missing_fields' }, { status: 400 });
    }

    const result = await changeUserRole(actor, targetUserId, newRole);
    if (result.status !== 200) {
      return NextResponse.json({ success: false, error: result.error, details: result.details || null }, { status: result.status });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

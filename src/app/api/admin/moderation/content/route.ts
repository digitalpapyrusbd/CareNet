import { NextResponse } from 'next/server';
import { moderateContent } from '@/lib/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contentId, action, actor, reason } = body;
    if (!contentId || !action) {
      return NextResponse.json({ success: false, error: 'missing_fields' }, { status: 400 });
    }

    const allowed = ['remove', 'approve', 'flag'];
    if (!allowed.includes(action)) {
      return NextResponse.json({ success: false, error: 'invalid_action' }, { status: 400 });
    }

    const result = await moderateContent(actor, contentId, action as any, reason);
    if (result.status !== 200) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

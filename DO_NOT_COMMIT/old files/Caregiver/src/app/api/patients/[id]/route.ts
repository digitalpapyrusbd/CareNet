import { NextResponse } from 'next/server';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ success: true, data: patient });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const updated = await prisma.patient.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await prisma.patient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

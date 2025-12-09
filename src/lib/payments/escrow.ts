// Prisma-backed escrow service for development
// Persists escrow records and ledger entries in the local database.
import prisma from '@/lib/db'

export async function holdFunds(orderId: string | undefined, amount: number, currency = 'BDT') {
  const created = await prisma.escrow_records.create({
    data: {
      external_ref: orderId ?? undefined,
      amount: amount as any,
      currency,
      status: 'HELD',
    },
  })

  // ledger entry
  await prisma.escrow_ledger.create({
    data: {
      escrow_id: created.id,
      action: 'HOLD',
      amount: amount as any,
      note: orderId ? `Hold for ${orderId}` : 'Hold funds',
    },
  })

  return created
}

export async function releaseEscrow(escrowId: string) {
  const found = await prisma.escrow_records.findUnique({ where: { id: escrowId } })
  if (!found) throw new Error('escrow_not_found')

  const updated = await prisma.escrow_records.update({
    where: { id: escrowId },
    data: { status: 'RELEASED', released_at: new Date() },
  })

  await prisma.escrow_ledger.create({
    data: {
      escrow_id: escrowId,
      action: 'RELEASE',
      amount: updated.amount as any,
      note: 'Released to provider/payer',
    },
  })

  return updated
}

export async function refundEscrow(escrowId: string, amount?: number) {
  const found = await prisma.escrow_records.findUnique({ where: { id: escrowId } })
  if (!found) throw new Error('escrow_not_found')

  const refundAmount = amount ?? Number(found.amount as any)
  const updated = await prisma.escrow_records.update({
    where: { id: escrowId },
    data: { status: 'REFUNDED', released_at: new Date() },
  })

  await prisma.escrow_ledger.create({
    data: {
      escrow_id: escrowId,
      action: 'REFUND',
      amount: refundAmount as any,
      note: 'Refund processed',
    },
  })

  return { escrowId, refundedAmount: refundAmount }
}

export async function getEscrow(escrowId: string) {
  return prisma.escrow_records.findUnique({ where: { id: escrowId }, include: { ledger_entries: true } })
}

export async function listEscrows() {
  return prisma.escrow_records.findMany({ include: { ledger_entries: true }, orderBy: { created_at: 'desc' } })
}

export default { holdFunds, releaseEscrow, refundEscrow, getEscrow, listEscrows }


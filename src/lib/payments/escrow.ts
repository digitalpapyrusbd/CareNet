// Prisma-backed escrow service for development
// Persists escrow records and ledger entries in the local database.
import prisma from '@/lib/db'

export async function holdFunds(orderId: string | undefined, amount: number, currency = 'BDT', userId?: string) {
  const created = await prisma.escrow_records.create({
    data: {
      user_id: userId || 'system', // TODO: Get actual userId from context
      amount: amount as any,
      currency,
      status: 'HELD',
    },
  })

  // ledger entry
  await prisma.escrow_ledger.create({
    data: {
      escrow_record_id: created.id,
      transaction_type: 'HOLD',
      amount: amount as any,
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
      escrow_record_id: escrowId,
      transaction_type: 'RELEASE',
      amount: updated.amount as any,
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
      escrow_record_id: escrowId,
      transaction_type: 'REFUND',
      amount: refundAmount as any,
    },
  })

  return { escrowId, refundedAmount: refundAmount }
}

export async function getEscrow(escrowId: string) {
  return prisma.escrow_records.findUnique({ where: { id: escrowId }, include: { escrow_ledger: true } })
}

export async function listEscrows() {
  return prisma.escrow_records.findMany({ include: { escrow_ledger: true }, orderBy: { created_at: 'desc' } })
}

export default { holdFunds, releaseEscrow, refundEscrow, getEscrow, listEscrows }


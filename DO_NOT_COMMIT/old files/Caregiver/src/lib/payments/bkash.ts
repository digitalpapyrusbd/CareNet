// bKash integration stub with in-memory transaction persistence
import { holdFunds, releaseEscrow } from './escrow'
import prisma from '@/lib/db'

export type BkashCheckoutParams = {
  amount: number
  currency?: string
  reference?: string
}

type TxRecord = {
  transactionId: string
  escrowId?: string
  amount: number
  currency: string
  reference?: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  createdAt: number
}

const transactions = new Map<string, TxRecord>()

export async function createCheckout({ amount, currency = 'BDT', reference }: BkashCheckoutParams) {
  const txId = `bk_${Date.now()}`
  // Hold funds in escrow for dev/testing (persisted)
  const escrow = await holdFunds(reference, Number(amount), currency)

  // Persist provider transaction
  const prov = await prisma.provider_transactions.create({
    data: {
      provider: 'bkash',
      provider_tx_id: txId,
      status: 'PENDING',
      amount: amount as any,
      currency,
      payload: {},
      escrow_id: escrow.id,
    }
  })

  // create initial log
  await prisma.transaction_logs.create({ data: { provider_transaction_id: prov.id, action: 'CREATE', previous_status: null, new_status: 'PENDING', note: 'Checkout created' } })

  const rec: TxRecord = {
    transactionId: txId,
    escrowId: escrow.id,
    amount: Number(amount),
    currency,
    reference: reference || txId,
    status: 'PENDING',
    createdAt: Date.now(),
  }
  transactions.set(txId, rec)
  return {
    checkoutUrl: `https://sandbox.bkash.com/checkout/${txId}`,
    transactionId: txId,
    amount: rec.amount,
    currency: rec.currency,
    reference: rec.reference,
    escrowId: escrow.id,
  }
}

export async function verifyPayment(transactionId: string) {
  // Update provider transaction record in DB
  const prov = await prisma.provider_transactions.findUnique({ where: { provider_tx_id: transactionId } })
  if (!prov) return { transactionId, status: 'NOT_FOUND' }

  const updated = await prisma.provider_transactions.update({ where: { id: prov.id }, data: { status: 'SUCCESS' } })
  await prisma.transaction_logs.create({ data: { provider_transaction_id: prov.id, action: 'VERIFY', previous_status: prov.status, new_status: 'SUCCESS', note: 'Verified by callback' } })

  // Release escrow if present
  if (prov.escrow_id) {
    try {
      await releaseEscrow(prov.escrow_id)
    } catch (e) {
      // ignore
    }
  }

  return {
    transactionId: updated.provider_tx_id,
    status: updated.status,
    provider: 'bkash',
    amount: Number(updated.amount as any),
    escrowId: updated.escrow_id,
  }
}

export async function getTransaction(transactionId: string) {
  return prisma.provider_transactions.findUnique({ where: { provider_tx_id: transactionId }, include: { logs: true } })
}

export async function listTransactions() {
  return prisma.provider_transactions.findMany({ orderBy: { created_at: 'desc' } })
}

export default {
  createCheckout,
  verifyPayment,
  getTransaction,
  listTransactions,
}

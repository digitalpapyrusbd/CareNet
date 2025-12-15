import { z } from 'zod'

export const CheckoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().optional(),
  reference: z.string().optional(),
})

export const CallbackSchema = z.object({
  transactionId: z.string(),
  status: z.string().optional(),
  amount: z.number().optional(),
  provider: z.string().optional(),
})

export const RefundSchema = z.object({
  escrowId: z.string(),
  amount: z.number().optional(),
  reason: z.string().optional(),
  provider: z.string().optional(),
  transactionId: z.string().optional(),
})

export type CheckoutInput = z.infer<typeof CheckoutSchema>
export type CallbackInput = z.infer<typeof CallbackSchema>
export type RefundInput = z.infer<typeof RefundSchema>

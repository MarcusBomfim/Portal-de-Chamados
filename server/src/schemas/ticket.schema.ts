import { z } from 'zod'

export const createTicketSchema = z.object({
  title: z.string().trim().min(5).max(180),
  description: z.string().trim().min(10).max(5_000),
  category: z.enum([
    'SYSTEMS_AND_ACCESS',
    'EQUIPMENT',
    'NETWORK',
    'PRINTING',
    'TELEPHONY',
    'OTHER',
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  unitId: z.uuid(),
})

export const createMessageSchema = z.object({
  content: z.string().trim().min(1).max(4_000),
  internal: z.boolean().default(false),
})

export const changeTicketStatusSchema = z.object({
  status: z.enum([
    'OPEN',
    'IN_PROGRESS',
    'WAITING_USER',
    'RESOLVED',
    'CLOSED',
    'CANCELED',
  ]),
  reason: z.string().trim().max(500).optional(),
})

export const ticketIdParamSchema = z.object({
  ticketId: z.uuid(),
})

export const attachmentParamSchema = z.object({
  ticketId: z.uuid(),
  attachmentId: z.uuid(),
})

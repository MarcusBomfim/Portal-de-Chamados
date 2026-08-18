import { z } from 'zod'

export const updateUserSchema = z
  .object({
    role: z.enum(['REQUESTER', 'TECHNICIAN', 'ADMIN']).optional(),
    unitId: z.uuid().nullable().optional(),
    active: z.boolean().optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  })

export const createUnitSchema = z.object({
  name: z.string().trim().min(3).max(160),
  acronym: z.string().trim().min(2).max(30).toUpperCase(),
  type: z.enum(['HEALTH_UNIT', 'SUPPORT_CENTER']),
  address: z.string().trim().min(3).max(255),
})

export const updateUnitSchema = z
  .object({
    name: z.string().trim().min(3).max(160).optional(),
    acronym: z.string().trim().min(2).max(30).toUpperCase().optional(),
    type: z.enum(['HEALTH_UNIT', 'SUPPORT_CENTER']).optional(),
    address: z.string().trim().min(3).max(255).optional(),
    active: z.boolean().optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  })

export const userIdParamSchema = z.object({ userId: z.uuid() })
export const unitIdParamSchema = z.object({ unitId: z.uuid() })

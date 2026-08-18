import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo.')
    .max(160, 'O nome deve ter no máximo 160 caracteres.'),
  email: z
    .email('Informe um e-mail válido.')
    .trim()
    .toLowerCase()
    .max(255, 'O e-mail deve ter no máximo 255 caracteres.'),
  password: z
    .string()
    .min(10, 'A senha deve ter pelo menos 10 caracteres.')
    .max(128, 'A senha deve ter no máximo 128 caracteres.'),
})

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.').trim().toLowerCase(),
  password: z.string().min(1, 'Informe sua senha.').max(128),
})

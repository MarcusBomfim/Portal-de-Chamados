import 'dotenv/config'
import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  CLIENT_URL: z.url().default('http://localhost:5173'),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(168).default(8),
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
})

const parsedEnvironment = environmentSchema.safeParse(process.env)

if (!parsedEnvironment.success) {
  console.error('Variáveis de ambiente inválidas:', parsedEnvironment.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsedEnvironment.data

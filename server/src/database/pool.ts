import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg

export const database = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

database.on('error', (error) => {
  console.error('Erro inesperado na conexão com o PostgreSQL:', error)
})

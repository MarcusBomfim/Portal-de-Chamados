import type { QueryResultRow } from 'pg'
import { database } from '../database/pool.js'
import type {
  AuthenticatedUser,
  UserWithPassword,
} from '../types/auth.js'

interface UserRecord extends QueryResultRow, UserWithPassword {}
interface PublicUserRecord extends QueryResultRow, AuthenticatedUser {}

export async function findUserByEmail(email: string) {
  const result = await database.query<UserRecord>(
    `SELECT
       id,
       full_name AS "fullName",
       email,
       password_hash AS "passwordHash",
       role,
       unit_id AS "unitId",
       active
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  )

  return result.rows[0] ?? null
}

export async function createUser(input: {
  fullName: string
  email: string
  passwordHash: string
}) {
  const result = await database.query<PublicUserRecord>(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'REQUESTER')
     RETURNING
       id,
       full_name AS "fullName",
       email,
       role,
       unit_id AS "unitId"`,
    [input.fullName, input.email, input.passwordHash],
  )

  return result.rows[0]
}

export async function findUserBySessionHash(tokenHash: string) {
  const result = await database.query<PublicUserRecord>(
    `SELECT
       users.id,
       users.full_name AS "fullName",
       users.email,
       users.role,
       users.unit_id AS "unitId"
     FROM sessions
     INNER JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1
       AND sessions.expires_at > NOW()
       AND users.active = TRUE
     LIMIT 1`,
    [tokenHash],
  )

  return result.rows[0] ?? null
}

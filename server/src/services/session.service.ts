import { createHash, randomBytes } from 'node:crypto'
import type { Response } from 'express'
import { env } from '../config/env.js'
import { database } from '../database/pool.js'

export const SESSION_COOKIE_NAME = 'portal_session'
const SESSION_DURATION_MS = env.SESSION_TTL_HOURS * 60 * 60 * 1000

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = hashSessionToken(token)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await database.query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt],
  )

  return token
}

export async function deleteSession(token: string) {
  await database.query('DELETE FROM sessions WHERE token_hash = $1', [
    hashSessionToken(token),
  ])
}

export async function deleteExpiredSessions() {
  await database.query('DELETE FROM sessions WHERE expires_at <= NOW()')
}

export function getSessionTokenHash(token: string) {
  return hashSessionToken(token)
}

export function setSessionCookie(response: Response, token: string) {
  response.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_MS,
  })
}

export function clearSessionCookie(response: Response) {
  response.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    path: '/',
  })
}

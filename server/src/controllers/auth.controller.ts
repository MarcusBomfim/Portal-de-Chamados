import type { NextFunction, Request, Response } from 'express'
import {
  createUser,
  findUserByEmail,
} from '../repositories/user.repository.js'
import { hashPassword, verifyPassword } from '../services/password.service.js'
import {
  clearSessionCookie,
  createSession,
  deleteExpiredSessions,
  deleteSession,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from '../services/session.service.js'
import type { AuthenticatedUser } from '../types/auth.js'

export async function register(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { fullName, email, password } = request.body as {
      fullName: string
      email: string
      password: string
    }

    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      response.status(409).json({ message: 'Este e-mail já está cadastrado.' })
      return
    }

    const passwordHash = await hashPassword(password)
    const user = await createUser({ fullName, email, passwordHash })

    if (!user) {
      throw new Error('Não foi possível criar o usuário.')
    }

    await deleteExpiredSessions()
    const sessionToken = await createSession(user.id)
    setSessionCookie(response, sessionToken)

    response.status(201).json({ user })
  } catch (error) {
    if (isUniqueViolation(error)) {
      response.status(409).json({ message: 'Este e-mail já está cadastrado.' })
      return
    }

    next(error)
  }
}

export async function login(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = request.body as {
      email: string
      password: string
    }
    const user = await findUserByEmail(email)

    if (!user || !user.passwordHash) {
      await hashPassword(password)
      response.status(401).json({ message: 'E-mail ou senha inválidos.' })
      return
    }

    const passwordIsValid = await verifyPassword(password, user.passwordHash)

    if (!passwordIsValid || !user.active) {
      response.status(401).json({ message: 'E-mail ou senha inválidos.' })
      return
    }

    await deleteExpiredSessions()
    const sessionToken = await createSession(user.id)
    setSessionCookie(response, sessionToken)

    const { passwordHash: _passwordHash, active: _active, ...publicUser } = user
    response.status(200).json({ user: publicUser })
  } catch (error) {
    next(error)
  }
}

export async function logout(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const token = request.cookies[SESSION_COOKIE_NAME] as string | undefined

    if (token) {
      await deleteSession(token)
    }

    clearSessionCookie(response)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
}

export function getCurrentUser(_request: Request, response: Response) {
  const user = response.locals.user as AuthenticatedUser
  response.status(200).json({ user })
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  )
}

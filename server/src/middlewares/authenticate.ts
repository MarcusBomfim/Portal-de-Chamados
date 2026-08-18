import type { NextFunction, Request, Response } from 'express'
import { findUserBySessionHash } from '../repositories/user.repository.js'
import {
  getSessionTokenHash,
  SESSION_COOKIE_NAME,
} from '../services/session.service.js'
import type { UserRole } from '../types/auth.js'

export async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const token = request.cookies[SESSION_COOKIE_NAME] as string | undefined

    if (!token) {
      response.status(401).json({ message: 'Autenticação necessária.' })
      return
    }

    const user = await findUserBySessionHash(getSessionTokenHash(token))

    if (!user) {
      response.status(401).json({ message: 'Sessão inválida ou expirada.' })
      return
    }

    response.locals.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (_request: Request, response: Response, next: NextFunction) => {
    const role = response.locals.user?.role as UserRole | undefined

    if (!role || !allowedRoles.includes(role)) {
      response.status(403).json({ message: 'Você não possui permissão para esta ação.' })
      return
    }

    next()
  }
}

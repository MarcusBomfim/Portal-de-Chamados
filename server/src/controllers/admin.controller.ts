import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/AppError.js'
import {
  createAdminUnit,
  listAdminUnits,
  listAdminUsers,
  updateAdminUnit,
  updateAdminUser,
} from '../repositories/admin.repository.js'
import type { AuthenticatedUser, UserRole } from '../types/auth.js'

export async function listUsers(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const users = await listAdminUsers()
    response.status(200).json({ users })
  } catch (error) {
    next(error)
  }
}

export async function updateUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const currentUser = response.locals.user as AuthenticatedUser
    const userId = request.params.userId as string
    const input = request.body as {
      role?: UserRole
      unitId?: string | null
      active?: boolean
    }

    if (
      userId === currentUser.id &&
      (input.active === false || (input.role && input.role !== 'ADMIN'))
    ) {
      throw new AppError(
        'Você não pode remover seu próprio acesso administrativo.',
        422,
      )
    }

    const user = await updateAdminUser(userId, input)

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404)
    }

    response.status(200).json({ user })
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      response.status(422).json({ message: 'A unidade selecionada não existe.' })
      return
    }

    next(error)
  }
}

export async function listUnits(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const units = await listAdminUnits()
    response.status(200).json({ units })
  } catch (error) {
    next(error)
  }
}

export async function storeUnit(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const unit = await createAdminUnit(request.body)
    response.status(201).json({ unit })
  } catch (error) {
    if (isUniqueViolation(error)) {
      response.status(409).json({ message: 'Já existe uma unidade com essa sigla.' })
      return
    }

    next(error)
  }
}

export async function updateUnit(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const unitId = request.params.unitId as string
    const unit = await updateAdminUnit(unitId, request.body)

    if (!unit) {
      throw new AppError('Unidade não encontrada.', 404)
    }

    response.status(200).json({ unit })
  } catch (error) {
    if (isUniqueViolation(error)) {
      response.status(409).json({ message: 'Já existe uma unidade com essa sigla.' })
      return
    }

    next(error)
  }
}

function isUniqueViolation(error: unknown) {
  return hasPostgresCode(error, '23505')
}

function isForeignKeyViolation(error: unknown) {
  return hasPostgresCode(error, '23503')
}

function hasPostgresCode(error: unknown, code: string) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  )
}

import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/AppError.js'
import { findTicketForUser } from '../repositories/ticket.repository.js'
import type { AuthenticatedUser } from '../types/auth.js'

export async function authorizeTicketAccess(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const ticketId = request.params.ticketId as string
    const user = response.locals.user as AuthenticatedUser
    const ticket = await findTicketForUser(ticketId, user)

    if (!ticket) {
      throw new AppError('Chamado não encontrado.', 404)
    }

    response.locals.ticket = ticket
    next()
  } catch (error) {
    next(error)
  }
}

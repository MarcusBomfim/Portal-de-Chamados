import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/AppError.js'
import {
  assignTicketToTechnician,
  changeTicketStatus,
  createTicket,
  createTicketMessage,
  findTicketForUser,
  listTicketMessages,
  listTicketsForUser,
} from '../repositories/ticket.repository.js'
import type { AuthenticatedUser } from '../types/auth.js'
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '../types/ticket.js'

export async function listTickets(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthenticatedUser(response)
    const tickets = await listTicketsForUser(user)
    response.status(200).json({ tickets })
  } catch (error) {
    next(error)
  }
}

export async function showTicket(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthenticatedUser(response)
    const ticketId = request.params.ticketId as string
    const ticket = await findTicketForUser(ticketId, user)

    if (!ticket) {
      throw new AppError('Chamado não encontrado.', 404)
    }

    const messages = await listTicketMessages(ticketId, user)
    response.status(200).json({ ticket, messages })
  } catch (error) {
    next(error)
  }
}

export async function storeTicket(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthenticatedUser(response)
    const input = request.body as {
      title: string
      description: string
      category: TicketCategory
      priority: TicketPriority
      unitId: string
    }
    const ticket = await createTicket(input, user)
    response.status(201).json({ ticket })
  } catch (error) {
    next(error)
  }
}

export async function storeMessage(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthenticatedUser(response)
    const ticketId = request.params.ticketId as string
    const { content, internal } = request.body as {
      content: string
      internal: boolean
    }
    const ticket = await findTicketForUser(ticketId, user)

    if (!ticket) {
      throw new AppError('Chamado não encontrado.', 404)
    }

    if (internal && user.role === 'REQUESTER') {
      throw new AppError('Solicitantes não podem criar notas internas.', 403)
    }

    if (ticket.status === 'CLOSED' || ticket.status === 'CANCELED') {
      throw new AppError('Não é possível responder a um chamado encerrado.', 422)
    }

    const message = await createTicketMessage({
      ticketId,
      authorId: user.id,
      content,
      internal,
    })

    response.status(201).json({ message })
  } catch (error) {
    next(error)
  }
}

export async function updateStatus(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthenticatedUser(response)
    const ticketId = request.params.ticketId as string
    const { status, reason } = request.body as {
      status: TicketStatus
      reason?: string
    }

    await changeTicketStatus({
      ticketId,
      nextStatus: status,
      changedById: user.id,
      reason,
    })

    const ticket = await findTicketForUser(ticketId, user)
    response.status(200).json({ ticket })
  } catch (error) {
    next(error)
  }
}

export async function assignToCurrentTechnician(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthenticatedUser(response)
    const ticketId = request.params.ticketId as string

    await assignTicketToTechnician(ticketId, user.id)

    const ticket = await findTicketForUser(ticketId, user)
    response.status(200).json({ ticket })
  } catch (error) {
    next(error)
  }
}

function getAuthenticatedUser(response: Response) {
  return response.locals.user as AuthenticatedUser
}

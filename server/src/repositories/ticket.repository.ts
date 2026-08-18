import type { QueryResultRow } from 'pg'
import { canChangeTicketStatus } from '../domain/ticketRules.js'
import { AppError } from '../errors/AppError.js'
import { database } from '../database/pool.js'
import type { AuthenticatedUser } from '../types/auth.js'
import type {
  TicketCategory,
  TicketMessageRecord,
  TicketPriority,
  TicketRecord,
  TicketStatus,
} from '../types/ticket.js'

interface TicketRow extends QueryResultRow, TicketRecord {}
interface TicketMessageRow extends QueryResultRow, TicketMessageRecord {}
interface StatusRow extends QueryResultRow {
  status: TicketStatus
}

const ticketSelect = `
  SELECT
    tickets.id,
    tickets.protocol,
    tickets.title,
    tickets.description,
    tickets.status,
    tickets.priority,
    tickets.category,
    tickets.requester_id AS "requesterId",
    requester.full_name AS "requesterName",
    tickets.unit_id AS "unitId",
    units.name AS "unitName",
    tickets.assigned_technician_id AS "assignedTechnicianId",
    technician.full_name AS "assignedTechnicianName",
    tickets.created_at AS "createdAt",
    tickets.updated_at AS "updatedAt",
    tickets.resolved_at AS "resolvedAt",
    tickets.closed_at AS "closedAt"
  FROM tickets
  INNER JOIN users AS requester ON requester.id = tickets.requester_id
  INNER JOIN units ON units.id = tickets.unit_id
  LEFT JOIN users AS technician ON technician.id = tickets.assigned_technician_id
`

export async function listTicketsForUser(user: AuthenticatedUser) {
  const requesterOnly = user.role === 'REQUESTER'
  const result = await database.query<TicketRow>(
    `${ticketSelect}
     ${requesterOnly ? 'WHERE tickets.requester_id = $1' : ''}
     ORDER BY
       CASE tickets.priority
         WHEN 'URGENT' THEN 1
         WHEN 'HIGH' THEN 2
         WHEN 'MEDIUM' THEN 3
         ELSE 4
       END,
       tickets.created_at DESC`,
    requesterOnly ? [user.id] : [],
  )

  return result.rows
}

export async function findTicketForUser(
  ticketId: string,
  user: AuthenticatedUser,
) {
  const canViewAll = user.role !== 'REQUESTER'
  const result = await database.query<TicketRow>(
    `${ticketSelect}
     WHERE tickets.id = $1
       AND ($2::boolean = TRUE OR tickets.requester_id = $3)
     LIMIT 1`,
    [ticketId, canViewAll, user.id],
  )

  return result.rows[0] ?? null
}

export async function createTicket(
  input: {
    title: string
    description: string
    category: TicketCategory
    priority: TicketPriority
    unitId: string
  },
  user: AuthenticatedUser,
) {
  const client = await database.connect()

  try {
    await client.query('BEGIN')

    const unit = await client.query(
      'SELECT id FROM units WHERE id = $1 AND active = TRUE',
      [input.unitId],
    )

    if (unit.rowCount === 0) {
      throw new AppError('A unidade selecionada não está disponível.', 422)
    }

    const sequenceResult = await client.query<{ number: string }>(
      `SELECT nextval('ticket_protocol_sequence')::text AS number`,
    )
    const sequenceNumber = sequenceResult.rows[0]?.number

    if (!sequenceNumber) {
      throw new Error('Não foi possível gerar o protocolo do chamado.')
    }

    const protocol = `CH-${new Date().getFullYear()}-${sequenceNumber.padStart(6, '0')}`
    const ticketResult = await client.query<{ id: string }>(
      `INSERT INTO tickets (
         protocol,
         title,
         description,
         category,
         priority,
         requester_id,
         unit_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        protocol,
        input.title,
        input.description,
        input.category,
        input.priority,
        user.id,
        input.unitId,
      ],
    )
    const ticketId = ticketResult.rows[0]?.id

    if (!ticketId) {
      throw new Error('Não foi possível criar o chamado.')
    }

    await client.query(
      `INSERT INTO ticket_status_history (
         ticket_id,
         changed_by_id,
         previous_status,
         new_status
       )
       VALUES ($1, $2, NULL, 'OPEN')`,
      [ticketId, user.id],
    )

    await client.query('COMMIT')

    const ticket = await findTicketForUser(ticketId, user)

    if (!ticket) {
      throw new Error('O chamado criado não pôde ser carregado.')
    }

    return ticket
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function listTicketMessages(
  ticketId: string,
  user: AuthenticatedUser,
) {
  const canViewInternal = user.role !== 'REQUESTER'
  const result = await database.query<TicketMessageRow>(
    `SELECT
       ticket_messages.id,
       ticket_messages.ticket_id AS "ticketId",
       ticket_messages.author_id AS "authorId",
       users.full_name AS "authorName",
       users.role AS "authorRole",
       ticket_messages.content,
       ticket_messages.internal,
       ticket_messages.created_at AS "createdAt"
     FROM ticket_messages
     INNER JOIN users ON users.id = ticket_messages.author_id
     WHERE ticket_messages.ticket_id = $1
       AND ($2::boolean = TRUE OR ticket_messages.internal = FALSE)
     ORDER BY ticket_messages.created_at ASC`,
    [ticketId, canViewInternal],
  )

  return result.rows
}

export async function createTicketMessage(input: {
  ticketId: string
  authorId: string
  content: string
  internal: boolean
}) {
  const result = await database.query<TicketMessageRow>(
    `WITH inserted_message AS (
       INSERT INTO ticket_messages (ticket_id, author_id, content, internal)
       VALUES ($1, $2, $3, $4)
       RETURNING *
     )
     SELECT
       inserted_message.id,
       inserted_message.ticket_id AS "ticketId",
       inserted_message.author_id AS "authorId",
       users.full_name AS "authorName",
       users.role AS "authorRole",
       inserted_message.content,
       inserted_message.internal,
       inserted_message.created_at AS "createdAt"
     FROM inserted_message
     INNER JOIN users ON users.id = inserted_message.author_id`,
    [input.ticketId, input.authorId, input.content, input.internal],
  )

  return result.rows[0]
}

export async function changeTicketStatus(input: {
  ticketId: string
  nextStatus: TicketStatus
  changedById: string
  reason?: string
}) {
  const client = await database.connect()

  try {
    await client.query('BEGIN')
    const currentResult = await client.query<StatusRow>(
      'SELECT status FROM tickets WHERE id = $1 FOR UPDATE',
      [input.ticketId],
    )
    const currentStatus = currentResult.rows[0]?.status

    if (!currentStatus) {
      throw new AppError('Chamado não encontrado.', 404)
    }

    if (!canChangeTicketStatus(currentStatus, input.nextStatus)) {
      throw new AppError('Essa mudança de status não é permitida.', 422)
    }

    await client.query(
      `UPDATE tickets
       SET
         status = $2,
         resolved_at = CASE
           WHEN $2 = 'RESOLVED' THEN NOW()
           WHEN $2 = 'IN_PROGRESS' THEN NULL
           ELSE resolved_at
         END,
         closed_at = CASE WHEN $2 = 'CLOSED' THEN NOW() ELSE closed_at END
       WHERE id = $1`,
      [input.ticketId, input.nextStatus],
    )

    await client.query(
      `INSERT INTO ticket_status_history (
         ticket_id,
         changed_by_id,
         previous_status,
         new_status,
         reason
       )
       VALUES ($1, $2, $3, $4, $5)`,
      [
        input.ticketId,
        input.changedById,
        currentStatus,
        input.nextStatus,
        input.reason ?? null,
      ],
    )

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function assignTicketToTechnician(
  ticketId: string,
  technicianId: string,
) {
  const client = await database.connect()

  try {
    await client.query('BEGIN')
    const currentResult = await client.query<StatusRow>(
      'SELECT status FROM tickets WHERE id = $1 FOR UPDATE',
      [ticketId],
    )
    const currentStatus = currentResult.rows[0]?.status

    if (!currentStatus) {
      throw new AppError('Chamado não encontrado.', 404)
    }

    if (currentStatus === 'CLOSED' || currentStatus === 'CANCELED') {
      throw new AppError('Não é possível assumir um chamado encerrado.', 422)
    }

    const nextStatus = currentStatus === 'OPEN' ? 'IN_PROGRESS' : currentStatus

    await client.query(
      `UPDATE tickets
       SET assigned_technician_id = $2, status = $3
       WHERE id = $1`,
      [ticketId, technicianId, nextStatus],
    )

    if (nextStatus !== currentStatus) {
      await client.query(
        `INSERT INTO ticket_status_history (
           ticket_id,
           changed_by_id,
           previous_status,
           new_status,
           reason
         )
         VALUES ($1, $2, $3, $4, 'Chamado assumido pelo técnico')`,
        [ticketId, technicianId, currentStatus, nextStatus],
      )
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

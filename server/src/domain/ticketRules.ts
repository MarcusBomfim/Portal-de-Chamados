import type { TicketStatus } from '../types/ticket.js'

const allowedStatusTransitions: Record<
  TicketStatus,
  readonly TicketStatus[]
> = {
  OPEN: ['IN_PROGRESS', 'CANCELED'],
  IN_PROGRESS: ['WAITING_USER', 'RESOLVED', 'CANCELED'],
  WAITING_USER: ['IN_PROGRESS', 'RESOLVED', 'CANCELED'],
  RESOLVED: ['IN_PROGRESS', 'CLOSED'],
  CLOSED: [],
  CANCELED: [],
}

export function canChangeTicketStatus(
  currentStatus: TicketStatus,
  nextStatus: TicketStatus,
) {
  return allowedStatusTransitions[currentStatus].includes(nextStatus)
}

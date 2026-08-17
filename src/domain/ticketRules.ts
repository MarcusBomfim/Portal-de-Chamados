import type { TicketStatus } from '../types'

export const allowedStatusTransitions: Record<
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

export function isFinalTicketStatus(status: TicketStatus) {
  return status === 'CLOSED' || status === 'CANCELED'
}

export const ticketStatuses = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_USER',
  'RESOLVED',
  'CLOSED',
  'CANCELED',
] as const

export const ticketPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const

export const ticketCategories = [
  'SYSTEMS_AND_ACCESS',
  'EQUIPMENT',
  'NETWORK',
  'PRINTING',
  'TELEPHONY',
  'OTHER',
] as const

export type TicketStatus = (typeof ticketStatuses)[number]
export type TicketPriority = (typeof ticketPriorities)[number]
export type TicketCategory = (typeof ticketCategories)[number]

export interface Ticket {
  id: string
  protocol: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  requesterId: string
  requesterName: string
  unitId: string
  unitName: string
  assignedTechnicianId: string | null
  assignedTechnicianName: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  closedAt: string | null
}

export interface TicketMessage {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  authorRole: 'REQUESTER' | 'TECHNICIAN' | 'ADMIN'
  content: string
  internal: boolean
  createdAt: string
}

export interface TicketAttachment {
  id: string
  ticketId: string
  messageId: string | null
  fileName: string
  contentType: string
  sizeInBytes: number
  uploadedById: string
  uploadedByName: string
  createdAt: string
}

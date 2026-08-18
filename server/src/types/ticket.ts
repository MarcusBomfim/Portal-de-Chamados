export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_USER'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELED'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type TicketCategory =
  | 'SYSTEMS_AND_ACCESS'
  | 'EQUIPMENT'
  | 'NETWORK'
  | 'PRINTING'
  | 'TELEPHONY'
  | 'OTHER'

export interface TicketRecord {
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
  createdAt: Date
  updatedAt: Date
  resolvedAt: Date | null
  closedAt: Date | null
}

export interface TicketMessageRecord {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  authorRole: 'REQUESTER' | 'TECHNICIAN' | 'ADMIN'
  content: string
  internal: boolean
  createdAt: Date
}

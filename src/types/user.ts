export const userRoles = ['REQUESTER', 'TECHNICIAN', 'ADMIN'] as const

export type UserRole = (typeof userRoles)[number]

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  unitId: string | null
  active: boolean
  createdAt: string
}

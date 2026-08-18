export type UserRole = 'REQUESTER' | 'TECHNICIAN' | 'ADMIN'

export interface AuthenticatedUser {
  id: string
  fullName: string
  email: string
  role: UserRole
  unitId: string | null
}

export interface UserWithPassword extends AuthenticatedUser {
  passwordHash: string | null
  active: boolean
}

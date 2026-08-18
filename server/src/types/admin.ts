import type { UserRole } from './auth.js'

export interface AdminUserRecord {
  id: string
  fullName: string
  email: string
  role: UserRole
  unitId: string | null
  unitName: string | null
  active: boolean
  createdAt: Date
}

export interface AdminUnitRecord {
  id: string
  name: string
  acronym: string
  type: 'HEALTH_UNIT' | 'SUPPORT_CENTER'
  address: string
  active: boolean
  createdAt: Date
}

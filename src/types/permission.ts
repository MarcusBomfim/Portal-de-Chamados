import type { UserRole } from './user'

export const permissions = [
  'TICKET_CREATE',
  'TICKET_VIEW_OWN',
  'TICKET_VIEW_ALL',
  'TICKET_REPLY',
  'TICKET_ASSIGN',
  'TICKET_CHANGE_STATUS',
  'TICKET_MANAGE',
  'USER_MANAGE',
  'UNIT_MANAGE',
] as const

export type Permission = (typeof permissions)[number]

export const permissionsByRole: Record<UserRole, readonly Permission[]> = {
  REQUESTER: ['TICKET_CREATE', 'TICKET_VIEW_OWN', 'TICKET_REPLY'],
  TECHNICIAN: [
    'TICKET_VIEW_ALL',
    'TICKET_REPLY',
    'TICKET_ASSIGN',
    'TICKET_CHANGE_STATUS',
  ],
  ADMIN: permissions,
}

export function hasPermission(role: UserRole, permission: Permission) {
  return permissionsByRole[role].includes(permission)
}

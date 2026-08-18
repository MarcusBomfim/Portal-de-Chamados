import { describe, expect, it } from 'vitest'
import { hasPermission } from './permission'

describe('permissões por perfil', () => {
  it('restringe a administração para solicitantes', () => {
    expect(hasPermission('REQUESTER', 'USER_MANAGE')).toBe(false)
  })

  it('permite que técnicos atendam e atualizem chamados', () => {
    expect(hasPermission('TECHNICIAN', 'TICKET_ASSIGN')).toBe(true)
    expect(hasPermission('TECHNICIAN', 'TICKET_CHANGE_STATUS')).toBe(true)
  })

  it('concede todas as permissões ao administrador', () => {
    expect(hasPermission('ADMIN', 'USER_MANAGE')).toBe(true)
    expect(hasPermission('ADMIN', 'UNIT_MANAGE')).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import { canChangeTicketStatus } from './ticketRules.js'

describe('regras de status da API', () => {
  it('permite o fluxo normal de atendimento', () => {
    expect(canChangeTicketStatus('OPEN', 'IN_PROGRESS')).toBe(true)
    expect(canChangeTicketStatus('IN_PROGRESS', 'RESOLVED')).toBe(true)
    expect(canChangeTicketStatus('RESOLVED', 'CLOSED')).toBe(true)
  })

  it('impede transições inválidas ou posteriores ao fechamento', () => {
    expect(canChangeTicketStatus('OPEN', 'CLOSED')).toBe(false)
    expect(canChangeTicketStatus('CLOSED', 'IN_PROGRESS')).toBe(false)
  })
})

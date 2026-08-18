import { describe, expect, it } from 'vitest'
import {
  allowedStatusTransitions,
  canChangeTicketStatus,
  isFinalTicketStatus,
} from './ticketRules'

describe('regras de status dos chamados', () => {
  it('permite iniciar o atendimento de um chamado aberto', () => {
    expect(canChangeTicketStatus('OPEN', 'IN_PROGRESS')).toBe(true)
  })

  it('impede fechar um chamado sem passar por resolvido', () => {
    expect(canChangeTicketStatus('IN_PROGRESS', 'CLOSED')).toBe(false)
  })

  it('não permite transições depois do encerramento', () => {
    expect(allowedStatusTransitions.CLOSED).toEqual([])
    expect(allowedStatusTransitions.CANCELED).toEqual([])
  })

  it('identifica os estados finais', () => {
    expect(isFinalTicketStatus('CLOSED')).toBe(true)
    expect(isFinalTicketStatus('CANCELED')).toBe(true)
    expect(isFinalTicketStatus('RESOLVED')).toBe(false)
  })
})

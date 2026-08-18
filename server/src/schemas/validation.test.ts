import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from './auth.schema.js'
import { createTicketSchema } from './ticket.schema.js'

describe('validação das entradas da API', () => {
  it('normaliza e aceita um cadastro válido', () => {
    const result = registerSchema.parse({
      fullName: '  Maria da Silva  ',
      email: 'MARIA@EXEMPLO.COM',
      password: 'senha-segura-123',
    })

    expect(result.fullName).toBe('Maria da Silva')
    expect(result.email).toBe('maria@exemplo.com')
  })

  it('rejeita senha curta no cadastro', () => {
    expect(
      registerSchema.safeParse({
        fullName: 'Maria da Silva',
        email: 'maria@exemplo.com',
        password: '123',
      }).success,
    ).toBe(false)
  })

  it('rejeita login com e-mail inválido', () => {
    expect(
      loginSchema.safeParse({ email: 'email-invalido', password: 'senha' })
        .success,
    ).toBe(false)
  })

  it('aceita um chamado completo e aplica a prioridade padrão', () => {
    const ticket = createTicketSchema.parse({
      title: 'Impressora sem conexão',
      description: 'A impressora da recepção não aparece na rede da unidade.',
      category: 'PRINTING',
      unitId: '9f6c3015-080a-4fab-9c1f-5e3461d4bb9b',
    })

    expect(ticket.priority).toBe('MEDIUM')
  })
})

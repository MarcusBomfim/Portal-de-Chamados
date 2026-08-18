import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from './password.service.js'

describe('proteção de senhas', () => {
  it('gera um hash diferente da senha e valida a credencial correta', async () => {
    const password = 'senha-segura-123'
    const passwordHash = await hashPassword(password)

    expect(passwordHash).not.toBe(password)
    expect(passwordHash).toMatch(/^scrypt\$/)
    expect(await verifyPassword(password, passwordHash)).toBe(true)
  })

  it('rejeita senha incorreta e hash malformado', async () => {
    const passwordHash = await hashPassword('senha-correta-123')

    expect(await verifyPassword('senha-errada-123', passwordHash)).toBe(false)
    expect(await verifyPassword('qualquer-senha', 'hash-invalido')).toBe(false)
  })
})

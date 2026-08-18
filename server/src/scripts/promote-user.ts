import { z } from 'zod'
import { database } from '../database/pool.js'

const emailResult = z.email().safeParse(process.argv[2]?.trim().toLowerCase())

if (!emailResult.success) {
  console.error('Informe um e-mail válido. Exemplo: npm run user:promote -- usuario@email.com')
  process.exitCode = 1
} else {
  try {
    const result = await database.query<{ full_name: string }>(
      `UPDATE users
       SET role = 'ADMIN', active = TRUE
       WHERE email = $1
       RETURNING full_name`,
      [emailResult.data],
    )
    const user = result.rows[0]

    if (!user) {
      console.error('Usuário não encontrado. Crie a conta antes de promovê-la.')
      process.exitCode = 1
    } else {
      console.log(`${user.full_name} agora possui o perfil de administrador.`)
    }
  } finally {
    await database.end()
  }
}

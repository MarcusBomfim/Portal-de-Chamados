import { app } from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.PORT, () => {
  console.log(`API disponível em http://localhost:${env.PORT}`)
})

function shutdown(signal: string) {
  console.log(`${signal} recebido. Encerrando a API...`)

  server.close((error) => {
    if (error) {
      console.error('Falha ao encerrar a API:', error)
      process.exit(1)
    }

    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

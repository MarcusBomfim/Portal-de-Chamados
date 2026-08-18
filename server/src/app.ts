import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { healthRouter } from './routes/health.routes.js'
import { authRouter } from './routes/auth.routes.js'
import { ticketRouter } from './routes/ticket.routes.js'
import { unitRouter } from './routes/unit.routes.js'

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/units', unitRouter)
app.use('/api/tickets', ticketRouter)

app.use((_request, response) => {
  response.status(404).json({ message: 'Rota não encontrada.' })
})

app.use(errorHandler)

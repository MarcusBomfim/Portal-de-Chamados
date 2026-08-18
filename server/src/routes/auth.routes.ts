import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import {
  getCurrentUser,
  login,
  logout,
  register,
} from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/authenticate.js'
import { validateBody } from '../middlewares/validateRequest.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'

export const authRouter = Router()

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
})

authRouter.post('/register', authRateLimiter, validateBody(registerSchema), register)
authRouter.post('/login', authRateLimiter, validateBody(loginSchema), login)
authRouter.post('/logout', authenticate, logout)
authRouter.get('/me', authenticate, getCurrentUser)

import { Router } from 'express'
import {
  checkApiHealth,
  checkDatabaseHealth,
} from '../controllers/health.controller.js'

export const healthRouter = Router()

healthRouter.get('/', checkApiHealth)
healthRouter.get('/database', checkDatabaseHealth)

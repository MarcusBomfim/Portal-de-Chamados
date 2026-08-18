import { Router } from 'express'
import { listUnits } from '../controllers/unit.controller.js'
import { authenticate } from '../middlewares/authenticate.js'

export const unitRouter = Router()

unitRouter.use(authenticate)
unitRouter.get('/', listUnits)

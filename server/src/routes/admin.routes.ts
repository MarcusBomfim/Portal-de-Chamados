import { Router } from 'express'
import {
  listUnits,
  listUsers,
  storeUnit,
  updateUnit,
  updateUser,
} from '../controllers/admin.controller.js'
import { authenticate, requireRole } from '../middlewares/authenticate.js'
import {
  validateBody,
  validateParams,
} from '../middlewares/validateRequest.js'
import {
  createUnitSchema,
  unitIdParamSchema,
  updateUnitSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../schemas/admin.schema.js'

export const adminRouter = Router()

adminRouter.use(authenticate, requireRole('ADMIN'))

adminRouter.get('/users', listUsers)
adminRouter.patch(
  '/users/:userId',
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  updateUser,
)

adminRouter.get('/units', listUnits)
adminRouter.post('/units', validateBody(createUnitSchema), storeUnit)
adminRouter.patch(
  '/units/:unitId',
  validateParams(unitIdParamSchema),
  validateBody(updateUnitSchema),
  updateUnit,
)

import { Router } from 'express'
import {
  assignToCurrentTechnician,
  listTickets,
  showTicket,
  storeMessage,
  storeTicket,
  updateStatus,
} from '../controllers/ticket.controller.js'
import { authenticate, requireRole } from '../middlewares/authenticate.js'
import {
  validateBody,
  validateParams,
} from '../middlewares/validateRequest.js'
import {
  changeTicketStatusSchema,
  createMessageSchema,
  createTicketSchema,
  ticketIdParamSchema,
} from '../schemas/ticket.schema.js'

export const ticketRouter = Router()

ticketRouter.use(authenticate)
ticketRouter.get('/', listTickets)
ticketRouter.post('/', validateBody(createTicketSchema), storeTicket)
ticketRouter.get('/:ticketId', validateParams(ticketIdParamSchema), showTicket)
ticketRouter.post(
  '/:ticketId/messages',
  validateParams(ticketIdParamSchema),
  validateBody(createMessageSchema),
  storeMessage,
)
ticketRouter.patch(
  '/:ticketId/status',
  requireRole('TECHNICIAN', 'ADMIN'),
  validateParams(ticketIdParamSchema),
  validateBody(changeTicketStatusSchema),
  updateStatus,
)
ticketRouter.patch(
  '/:ticketId/assign',
  requireRole('TECHNICIAN', 'ADMIN'),
  validateParams(ticketIdParamSchema),
  assignToCurrentTechnician,
)

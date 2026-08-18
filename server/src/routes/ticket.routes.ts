import { Router } from 'express'
import {
  assignToCurrentTechnician,
  listTickets,
  showTicket,
  storeMessage,
  storeTicket,
  updateStatus,
} from '../controllers/ticket.controller.js'
import {
  downloadAttachment,
  storeAttachment,
} from '../controllers/attachment.controller.js'
import { uploadAttachment } from '../config/upload.js'
import { authenticate, requireRole } from '../middlewares/authenticate.js'
import { authorizeTicketAccess } from '../middlewares/authorizeTicketAccess.js'
import {
  validateBody,
  validateParams,
} from '../middlewares/validateRequest.js'
import {
  changeTicketStatusSchema,
  attachmentParamSchema,
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
ticketRouter.post(
  '/:ticketId/attachments',
  validateParams(ticketIdParamSchema),
  authorizeTicketAccess,
  uploadAttachment.single('file'),
  storeAttachment,
)
ticketRouter.get(
  '/:ticketId/attachments/:attachmentId',
  validateParams(attachmentParamSchema),
  authorizeTicketAccess,
  downloadAttachment,
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

import type { QueryResultRow } from 'pg'
import { database } from '../database/pool.js'
import type { AttachmentRecord } from '../types/attachment.js'

interface AttachmentRow extends QueryResultRow, AttachmentRecord {}

const attachmentSelect = `
  SELECT
    ticket_attachments.id,
    ticket_attachments.ticket_id AS "ticketId",
    ticket_attachments.message_id AS "messageId",
    ticket_attachments.file_name AS "fileName",
    ticket_attachments.storage_key AS "storageKey",
    ticket_attachments.content_type AS "contentType",
    ticket_attachments.size_in_bytes AS "sizeInBytes",
    ticket_attachments.uploaded_by_id AS "uploadedById",
    users.full_name AS "uploadedByName",
    ticket_attachments.created_at AS "createdAt"
  FROM ticket_attachments
  INNER JOIN users ON users.id = ticket_attachments.uploaded_by_id
`

export async function listTicketAttachments(ticketId: string) {
  const result = await database.query<AttachmentRow>(
    `${attachmentSelect}
     WHERE ticket_attachments.ticket_id = $1
     ORDER BY ticket_attachments.created_at DESC`,
    [ticketId],
  )

  return result.rows
}

export async function createAttachment(input: {
  ticketId: string
  fileName: string
  storageKey: string
  contentType: string
  sizeInBytes: number
  uploadedById: string
}) {
  const result = await database.query<AttachmentRow>(
    `WITH inserted_attachment AS (
       INSERT INTO ticket_attachments (
         ticket_id,
         file_name,
         storage_key,
         content_type,
         size_in_bytes,
         uploaded_by_id
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *
     )
     SELECT
       inserted_attachment.id,
       inserted_attachment.ticket_id AS "ticketId",
       inserted_attachment.message_id AS "messageId",
       inserted_attachment.file_name AS "fileName",
       inserted_attachment.storage_key AS "storageKey",
       inserted_attachment.content_type AS "contentType",
       inserted_attachment.size_in_bytes AS "sizeInBytes",
       inserted_attachment.uploaded_by_id AS "uploadedById",
       users.full_name AS "uploadedByName",
       inserted_attachment.created_at AS "createdAt"
     FROM inserted_attachment
     INNER JOIN users ON users.id = inserted_attachment.uploaded_by_id`,
    [
      input.ticketId,
      input.fileName,
      input.storageKey,
      input.contentType,
      input.sizeInBytes,
      input.uploadedById,
    ],
  )

  return result.rows[0]
}

export async function findAttachment(
  ticketId: string,
  attachmentId: string,
) {
  const result = await database.query<AttachmentRow>(
    `${attachmentSelect}
     WHERE ticket_attachments.ticket_id = $1
       AND ticket_attachments.id = $2
     LIMIT 1`,
    [ticketId, attachmentId],
  )

  return result.rows[0] ?? null
}
